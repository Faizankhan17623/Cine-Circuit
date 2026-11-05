const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

process.env.JWT_PRIVATE_KEY = 'backend-test-secret';
// Fake gateway credentials: set before dotenv runs so no test can reach the real Razorpay account
process.env.RAZORPAY_KEY_ID = 'rzp_test_backend';
process.env.RAZORPAY_KEY_SECRETS = 'razorpay-test-secret';
process.env.RAZORPAY_HEADERS = 'razorpay-webhook-test-secret';
// No database in unit tests: an unstubbed model call fails at once instead of hanging
mongoose.set('bufferCommands', false);
// sendPdf loads puppeteer (headless Chrome) at require time; no test renders a PDF, and puppeteer is
// missing from package-lock.json, so it is not installed everywhere
const sendPdfPath = require.resolve('../templates/userTemplates/sendPdf');
require.cache[sendPdfPath] = { id: sendPdfPath, filename: sendPdfPath, loaded: true, exports: async () => Buffer.alloc(0) };

const { signPaymentId, generateTicketQrDataUrl } = require('../utils/generateTicketQr');
const { auth } = require('../middlewares/verification');
const USER = require('../models/user');
const OTP = require('../models/otp');
const CreateShow = require('../models/CreateShow');
const Payment = require('../models/payment');
const Wallet = require('../models/Wallet');
const genre = require('../models/genre');
const subgenre = require('../models/subgenre');
const razorpay = require('../config/razorpay');
const mailTransport = require('../config/nodemailer');
const { CreateOrgainezer, OrgaineserLogin } = require('../controllers/Orgainezer/CreateOrg');
const { UpdateShowtitle, deleteShow } = require('../controllers/Orgainezer/CreateTheatreShow');
const { CancelTicket } = require('../controllers/common/CancelTicket');
const { Verifypayment, expireUnpaidWalletPayments } = require('../controllers/common/Payment');
const { HandlePaymentWebhook } = require('../controllers/common/PaymentWebhook');
const { deleteAllsubGenres } = require('../controllers/Administrator/CreateSubGenre');

// Stand-in for a mongoose query: awaitable, and every chained call resolves to the same value
const query = (value) => {
  const promise = Promise.resolve(value);
  for (const method of ['populate', 'select', 'sort', 'limit', 'session', 'exec']) promise[method] = () => query(value);
  return promise;
};
const stub = (t, object, key, value) => {
  const original = object[key];
  object[key] = value;
  t.after(() => { object[key] = original; });
};
const fakeRes = () => ({
  status(code) { this.code = code; return this; },
  json(body) { this.body = body; return this; },
});
const fakeSession = async () => ({ withTransaction: async (fn) => fn(), endSession: async () => {} });

test('payment QR signatures are deterministic and change with the payment id', () => {
  const first = signPaymentId('pay_123');
  assert.match(first, /^[a-f0-9]{16}$/);
  assert.equal(first, signPaymentId('pay_123'));
  assert.notEqual(first, signPaymentId('pay_456'));
});

test('ticket QR data is returned as a PNG data URL', async () => {
  const qr = await generateTicketQrDataUrl('pay_123');
  assert.match(qr, /^data:image\/png;base64,/);
});

test('auth rejects requests without a token', async () => {
  let nextCalled = false;
  const response = {
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await auth({ cookies: {}, body: {}, header: () => undefined }, response, () => {
    nextCalled = true;
  });

  assert.equal(response.code, 401);
  assert.equal(response.body.message, 'Token Missing');
  assert.equal(nextCalled, false);
});

test('auth accepts a valid bearer token and attaches the user id', async () => {
  const token = jwt.sign({ id: 'user_123' }, process.env.JWT_PRIVATE_KEY);
  const request = {
    cookies: {},
    body: {},
    header(name) {
      return name === 'Authorization' ? `Bearer ${token}` : undefined;
    },
  };
  let nextCalled = false;

  await auth(request, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(request.USER, { id: 'user_123' });
});

test('organizer signup ignores a usertype in the body and accepts a numeric OTP', async (t) => {
  stub(t, USER, 'findOne', () => query(null));
  stub(t, OTP, 'find', () => query([{ otp: '123456' }]));
  let saved;
  stub(t, USER.prototype, 'save', async function save() { saved = this; });
  const res = fakeRes();

  await CreateOrgainezer({ body: {
    name: 'Mallory', password: 'pw', email: 'mallory@example.com', number: '9999999999',
    countrycode: '+91', otp: 123456, usertype: 'Administrator',
  } }, res);

  assert.equal(res.code, 200);
  assert.equal(saved.usertype, 'Organizer');
});

test('organizer login refuses non-organizer accounts', async (t) => {
  // Correct password, so only the role check can stop the login
  stub(t, USER, 'findOne', () => query({ usertype: 'Administrator', confirmpass: bcrypt.hashSync('pw', 4) }));
  const res = fakeRes();

  await OrgaineserLogin({ body: { email: 'admin@example.com', password: 'pw' } }, res);

  assert.equal(res.code, 400);
  assert.equal(res.body.token, undefined);
});

test('show updates look up the requested show and the ownership list together', async (t) => {
  const owned = new mongoose.Types.ObjectId();
  const othersShow = String(new mongoose.Types.ObjectId());
  stub(t, USER, 'findById', () => query({ showsCreated: [owned] }));
  let filter;
  stub(t, CreateShow, 'findOne', (f) => { filter = f; return query(null); });
  const res = fakeRes();

  await UpdateShowtitle({ query: { id: othersShow }, body: { newTitle: 'Hijacked' }, USER: { id: 'u1' } }, res);

  assert.equal(res.code, 400);
  assert.deepEqual(filter, { $and: [{ _id: othersShow }, { _id: { $in: [owned] } }] });
});

test('deleting a show deletes only the requested owned show and unlinks it from the owner', async (t) => {
  const owned = new mongoose.Types.ObjectId();
  stub(t, USER, 'findById', () => query({ showsCreated: [owned] }));
  let filter;
  stub(t, CreateShow, 'findOneAndDelete', (f) => { filter = f; return query({ _id: owned }); });
  let ownerUpdate;
  stub(t, USER, 'updateOne', (f, update) => { ownerUpdate = [f, update]; return query({}); });
  const res = fakeRes();

  await deleteShow({ query: { showId: String(owned) }, USER: { id: 'u1' } }, res);

  assert.equal(res.code, 200);
  assert.deepEqual(filter, { $and: [{ _id: String(owned) }, { _id: { $in: [owned] } }] });
  assert.deepEqual(ownerUpdate, [{ _id: 'u1' }, { $pull: { showsCreated: owned } }]);
});

test('a ticket cannot be cancelled twice: not after a pending bank refund, not by a racing request', async (t) => {
  const inTenDays = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const Showdate = `${String(inTenDays.getDate()).padStart(2, '0')}/${String(inTenDays.getMonth() + 1).padStart(2, '0')}/${inTenDays.getFullYear()}`;
  const ticket = { _id: 'p1', userid: 'u1', Payment_Status: 'success', razorpay_payment_id: 'pay_1', Showdate, time: '18:00', amount: 100 };
  let current;
  stub(t, Payment, 'findById', () => query(current));
  let claims = 0;
  stub(t, Payment, 'findOneAndUpdate', () => { claims += 1; return query(null); });
  let refunds = 0;
  stub(t, razorpay.payments, 'refund', async () => { refunds += 1; });

  // First cancel already started a normal-speed bank refund: a second (wallet) cancel must be refused
  current = { ...ticket, cancelled: true, refundStatus: 'pending', refundId: 'rfnd_1' };
  const again = fakeRes();
  await CancelTicket({ USER: { id: 'u1' }, body: { paymentId: 'p1', refundToWallet: true } }, again);
  assert.equal(again.code, 400);
  assert.equal(claims, 0);

  // Concurrent request: it read the ticket as uncancelled but lost the atomic claim
  current = { ...ticket, cancelled: false, refundStatus: 'none', refundId: null };
  const racing = fakeRes();
  await CancelTicket({ USER: { id: 'u1' }, body: { paymentId: 'p1', refundToWallet: true } }, racing);
  assert.equal(racing.code, 409);
  assert.equal(claims, 1);
  assert.equal(refunds, 0);
});

// Wallet stubs shared by the payment tests: records every credit, in rupees
const recordCredits = (t) => {
  const credits = [];
  stub(t, Wallet, 'findOne', () => query({ balance: 0 }));
  stub(t, Wallet, 'findOneAndUpdate', (f, update) => { credits.push(update.$inc.balance); return query({}); });
  return credits;
};

test('expired unpaid checkouts get their wallet amount back exactly once', async (t) => {
  stub(t, mongoose, 'startSession', fakeSession);
  let scan;
  stub(t, Payment, 'find', (filter) => { scan = filter; return query([{ _id: 'a' }, { _id: 'b' }]); });
  const closeFilters = [];
  // 'b' was paid or closed after the scan, so the atomic 'created' -> 'failure' update misses it
  stub(t, Payment, 'findOneAndUpdate', (filter) => {
    closeFilters.push(filter);
    return query(filter._id === 'a' ? { _id: 'a', userid: 'u1', walletAmountUsed: 40 } : null);
  });
  const credits = recordCredits(t);

  await expireUnpaidWalletPayments();

  assert.deepEqual(credits, [40]);
  assert.ok(closeFilters.every((filter) => filter.Payment_Status === 'created'));
  assert.equal(scan.Payment_Status, 'created');
  assert.deepEqual(scan.walletAmountUsed, { $gt: 0 });
  assert.ok(scan.razorpay_order_id.$not.test('wallet_123'));
  assert.ok(scan.createdAt.$lt <= new Date(Date.now() - 30 * 60 * 1000));
});

test('a failed signature returns the wallet portion once, even when verification is retried', async (t) => {
  stub(t, mongoose, 'startSession', fakeSession);
  stub(t, USER, 'findOne', () => query({ email: 'buyer@example.com', userName: 'buyer' }));
  stub(t, Payment, 'findOne', () => query({ _id: 'p1', userid: 'u1', Payment_Status: 'created', amount: 60, walletAmountUsed: 40 }));
  let status = 'created';
  stub(t, Payment, 'findOneAndUpdate', (filter, update) => {
    if (filter.Payment_Status !== status) return query(null);
    status = update.Payment_Status;
    return query({ _id: 'p1', userid: 'u1', walletAmountUsed: 40 });
  });
  stub(t, mailTransport, 'sendMail', async () => ({}));
  const credits = recordCredits(t);
  const request = { USER: { id: 'u1' }, body: { razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_1', razorpay_signature: 'forged', paymentId: 'p1' } };

  const first = fakeRes();
  await Verifypayment(request, first);
  await Verifypayment(request, fakeRes());

  assert.equal(first.code, 400);
  assert.equal(status, 'failure');
  assert.deepEqual(credits, [40]);
});

test('a capture arriving after the order expired is refunded once, without crediting the wallet again', async (t) => {
  stub(t, Payment, 'findOne', () => query({ _id: 'p1', userid: 'u1', Payment_Status: 'failure', amount: 60, walletAmountUsed: 40 }));
  let claimed = false;
  stub(t, Payment, 'findOneAndUpdate', (filter) => {
    if (filter.Payment_Status === 'created') return query(null);
    if (filter.Payment_Status === 'failure') {
      if (claimed || filter.razorpay_payment_id !== null) return query(null);
      claimed = true;
      return query({ _id: 'p1', amount: 60, walletAmountUsed: 40 });
    }
    return query({});
  });
  const refunds = [];
  stub(t, razorpay.payments, 'refund', async (id, options) => { refunds.push([id, options.amount]); return { id: 'rfnd_1', status: 'pending' }; });
  stub(t, USER, 'findById', () => query(null));
  const credits = recordCredits(t);
  const deliver = async (event) => {
    const body = JSON.stringify({ event, payload: { payment: { entity: { id: 'pay_late', order_id: 'order_1', status: 'captured' } } } });
    const signature = crypto.createHmac('sha256', process.env.RAZORPAY_HEADERS).update(body).digest('hex');
    const res = fakeRes();
    await HandlePaymentWebhook({ body: Buffer.from(body), get: () => signature }, res);
    return res;
  };

  // Razorpay sends both events for one capture
  const captured = await deliver('payment.captured');
  const paid = await deliver('order.paid');

  assert.equal(captured.body.refunded, true);
  assert.equal(paid.body.refunded, false);
  assert.deepEqual(refunds, [['pay_late', 6000]]);
  assert.deepEqual(credits, []);
});

test('removing all sub genres needs a real genre id and only touches that genre', async (t) => {
  let deleteFilter;
  stub(t, subgenre, 'deleteMany', (f) => { deleteFilter = f; return query({ deletedCount: 2 }); });

  const injected = fakeRes();
  await deleteAllsubGenres({ body: { id: {} } }, injected);
  assert.equal(injected.code, 400);
  assert.equal(deleteFilter, undefined);

  const genreId = new mongoose.Types.ObjectId();
  const subs = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
  stub(t, genre, 'findById', () => query({ _id: genreId, subgeneres: subs }));
  let unlink;
  stub(t, genre, 'updateMany', (f, update) => { unlink = [f, update]; return query({}); });
  const res = fakeRes();

  await deleteAllsubGenres({ body: { id: String(genreId) } }, res);

  assert.equal(res.code, 200);
  assert.deepEqual(deleteFilter, { _id: { $in: subs } });
  assert.deepEqual(unlink, [{ subgeneres: { $in: subs } }, { $pull: { subgeneres: { $in: subs } } }]);
});

// ---- Stage 2 (high) fixes ----
const { uploadtheshow } = require('../controllers/Orgainezer/upload');
const { updateCastname } = require('../controllers/Orgainezer/CreateCast');
const { DeleteTagsname } = require('../controllers/Orgainezer/CreateHashtags');
const { deleteOrgainezer, DeleteAllOrgainezers } = require('../controllers/Administrator/AdminVerification');
const { TicketDistributionSystem } = require('../controllers/Theatrer/TicketDistrubation');
const { DeleteAllShow, parseReleaseDate } = require('../controllers/Orgainezer/CreateTheatreShow');
const { refundLostRaceCharge } = require('../controllers/common/Payment');
const pdfTemplate = require('../templates/userTemplates/pdfTemplate');
const ticketTemplate = require('../templates/userTemplates/TicketTemplate');
const escapeHtml = require('../utils/escapeHtml');
const cast = require('../models/Createcast');
const hashtags = require('../models/CreateHashtags');
const Theatres = require('../models/Theatres');
const Theatrestickets = require('../models/TheatresTicket');
const Coupon = require('../models/Coupon');
const Referral = require('../models/Referral');
const Notification = require('../models/Notification');
const { Orgdata } = require('../models/Org_data');

test('an organizer can only upload a show they created', async (t) => {
  const owned = new mongoose.Types.ObjectId();
  const othersShow = String(new mongoose.Types.ObjectId());
  stub(t, USER, 'findById', () => query({ showsCreated: [owned] }));
  let filter;
  stub(t, CreateShow, 'findOne', (f) => { filter = f; return query(null); });
  let updated = false;
  stub(t, CreateShow, 'findByIdAndUpdate', () => { updated = true; return query({}); });
  const res = fakeRes();

  await uploadtheshow({ query: { id: othersShow }, USER: { id: 'u1' } }, res);

  assert.equal(res.code, 400);
  assert.equal(updated, false);
  assert.deepEqual(filter, { $and: [{ _id: othersShow }, { _id: { $in: [owned] } }] });
});

test('cast and tag edits are limited to the caller, and tag delete reads the id the frontend sends', async (t) => {
  const filters = [];
  stub(t, cast, 'findOne', (f) => { filters.push(f); return query(null); });
  stub(t, hashtags, 'findOne', (f) => { filters.push(f); return query(null); });
  let deleted = false;
  stub(t, hashtags, 'findByIdAndDelete', () => { deleted = true; return query({}); });

  const renamed = fakeRes();
  await updateCastname({ body: { id: 'c1', newname: 'x' }, USER: { id: 'u1' } }, renamed);
  // Frontend: apiConnector("DELETE", DeleteTagsname, { id })
  const removed = fakeRes();
  await DeleteTagsname({ body: { id: 'h1' }, USER: { id: 'u1' } }, removed);

  assert.equal(renamed.code, 400);
  assert.equal(removed.code, 400);
  assert.equal(deleted, false);
  assert.deepEqual(filters, [{ _id: 'c1', userid: 'u1' }, { _id: 'h1', userid: 'u1' }]);
});

test('ticket PDF and booking email escape booking data and only embed our own QR data URL', () => {
  const evil = '<script>alert(1)</script>';
  const html = pdfTemplate({
    _id: 'p1', movieName: evil, theatreName: '"><img src=x onerror=alert(1)>', theatreLocation: evil,
    Showdate: evil, paymentMethod: evil, Payment_Status: evil,
    categoryDetails: [{ categoryName: evil, ticketCount: 1, price: 100, seats: [evil] }],
    qrCodeDataUrl: '" onerror="alert(1)',
  });
  assert.equal(html.includes('<script>'), false);
  assert.equal(html.includes('<img src=x'), false);
  assert.equal(html.includes('alt="Ticket QR Code"'), false);
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));

  const withQr = pdfTemplate({ _id: 'p1', categoryDetails: [], qrCodeDataUrl: 'data:image/png;base64,iVBORw0KGgo=' });
  assert.ok(withQr.includes('src="data:image/png;base64,iVBORw0KGgo="'));

  const mail = ticketTemplate({ _id: 'p1', Showdate: evil, paymentMethod: evil, amount: evil });
  assert.equal(mail.includes('<script>'), false);
  assert.equal(escapeHtml(`&<>"'`), '&amp;&lt;&gt;&quot;&#39;');
  assert.equal(escapeHtml(undefined), '');
});

test('admins can delete organizers only, never other account types', async (t) => {
  stub(t, USER, 'findOne', () => query(null)); // the id belongs to an admin, so the Organizer lookup misses
  let deleted = false;
  stub(t, USER, 'findOneAndDelete', () => { deleted = true; return query({}); });
  const one = fakeRes();
  await deleteOrgainezer({ body: { id: 'admin1' } }, one);
  assert.equal(one.code, 404);
  assert.equal(deleted, false);

  const orgId = new mongoose.Types.ObjectId();
  let findFilter;
  stub(t, USER, 'find', (f) => { findFilter = f; return query([{ _id: orgId, orgainezerdata: 'od1' }]); });
  let deleteFilter;
  stub(t, USER, 'deleteMany', (f) => { deleteFilter = f; return query({ deletedCount: 1 }); });
  let orgdataFilter;
  stub(t, Orgdata, 'deleteMany', (f) => { orgdataFilter = f; return query({}); });
  const all = fakeRes();
  await DeleteAllOrgainezers({ body: { id: [String(orgId), 'admin1'] } }, all);
  assert.equal(all.code, 200);
  assert.deepEqual(findFilter, { _id: { $in: [String(orgId), 'admin1'] }, usertype: 'Organizer' });
  assert.deepEqual(deleteFilter, { _id: { $in: [orgId] }, usertype: 'Organizer' });
  assert.deepEqual(orgdataFilter, { _id: { $in: ['od1'] } });
});

test('ticket distribution rejects bad category entries and unapproved theatres before touching stock', async (t) => {
  stub(t, mongoose, 'startSession', async () => ({ endSession() {}, inTransaction: () => false }));
  stub(t, CreateShow, 'findById', () => query({ _id: 's1' }));
  stub(t, USER, 'findById', () => query({ theatresCreated: 'th1' }));
  let theatre;
  stub(t, Theatres, 'findById', () => query(theatre));
  stub(t, Theatrestickets, 'findOne', () => query(null));
  let created = false;
  stub(t, Theatrestickets, 'create', async () => { created = true; return [{}]; });
  const inFiveDays = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const ReleaseDate = `${String(inFiveDays.getDate()).padStart(2, '0')}/${String(inFiveDays.getMonth() + 1).padStart(2, '0')}/${inFiveDays.getFullYear()}`;
  const distribute = async (ticketsCreation) => {
    const res = fakeRes();
    await TicketDistributionSystem({ USER: { id: 'u1' }, query: { ShowId: 's1' }, body: { ticketsCreation, ReleaseDate } }, res);
    return res;
  };
  const allotments = [{ showId: 's1', price: 100, ticketsReceived: 10, ticketsDistributed: 0 }];

  theatre = { _id: 'th1', status: 'Rejected', allotments };
  assert.equal((await distribute([{ category: 'VIP', numberOftickets: 5, price: 100 }])).code, 403);

  theatre = { _id: 'th1', status: 'Approved', allotments };
  // -5 + 15 = 10 fits the allotment of 10 on paper, but would create 15 VIP seats
  const invalid = [
    [{ category: 'Standard', numberOftickets: -5, price: 100 }, { category: 'VIP', numberOftickets: 15, price: 100 }],
    [{ category: 'VIP', numberOftickets: 2.5, price: 100 }],
    [{ category: 'VIP', numberOftickets: 2, price: -100 }],
    [{ category: 'Balcony', numberOftickets: 2, price: 100 }],
    [{ category: 'VIP', numberOftickets: 2, price: 100 }, { category: 'VIP', numberOftickets: 2, price: 100 }],
  ];
  for (const entries of invalid) {
    assert.equal((await distribute(entries)).code, 400, JSON.stringify(entries));
  }
  assert.equal(created, false);
});

test('show status cron can parse the stored release date formats', () => {
  const stored = parseReleaseDate('Mon, 05 May 2025');
  assert.deepEqual([stored.getFullYear(), stored.getMonth(), stored.getDate()], [2025, 4, 5]);
  const seeded = parseReleaseDate('2025-12-25');
  assert.deepEqual([seeded.getFullYear(), seeded.getMonth(), seeded.getDate()], [2025, 11, 25]);
  assert.ok(isNaN(parseReleaseDate('not a date').getTime()));
});

test('deleting all shows also unlinks them from the organizer', async (t) => {
  const owned = [new mongoose.Types.ObjectId()];
  stub(t, USER, 'findById', () => query({ showsCreated: owned }));
  stub(t, CreateShow, 'deleteMany', () => query({ deletedCount: 1 }));
  let ownerUpdate;
  stub(t, USER, 'updateOne', (f, update) => { ownerUpdate = [f, update]; return query({}); });
  const res = fakeRes();

  await DeleteAllShow({ USER: { id: 'u1' } }, res);

  assert.equal(res.code, 200);
  assert.deepEqual(ownerUpdate, [{ _id: 'u1' }, { $pull: { showsCreated: { $in: owned } } }]);
});

test('a successful booking writes user, coupon and show inside the transaction and ends the session', async (t) => {
  const session = {
    active: false,
    ended: false,
    startTransaction() { this.active = true; },
    async commitTransaction() { this.active = false; },
    async abortTransaction() { this.active = false; },
    inTransaction() { return this.active; },
    async endSession() { this.ended = true; },
  };
  stub(t, mongoose, 'startSession', async () => session);
  stub(t, USER, 'findOne', () => query({ email: 'buyer@example.com' }));
  const payment = { _id: 'p1', userid: 'u1', razorpay_order_id: 'order_1', Payment_Status: 'created', amount: 5, walletAmountUsed: 0, ticketCategorey: [], ticketid: 't1', showid: 's1', couponCode: 'SAVE' };
  stub(t, Payment, 'findOne', () => query(payment));
  stub(t, razorpay.payments, 'fetch', async () => ({ order_id: 'order_1', status: 'captured', amount: 500, method: 'card' }));
  stub(t, Payment, 'findOneAndUpdate', () => query({ ...payment, Payment_Status: 'success' }));
  stub(t, Theatrestickets, 'findOneAndUpdate', () => query({}));
  stub(t, Referral, 'findOneAndUpdate', () => query(null));
  stub(t, Notification, 'create', async () => ({ toObject: () => ({}) }));
  stub(t, CreateShow, 'findOne', () => query(null)); // PDF build fails; the mail is best-effort
  stub(t, Theatres, 'findOne', () => query(null));
  const writes = {};
  stub(t, USER, 'findByIdAndUpdate', (id, update, options) => { writes.user = options; return query({}); });
  stub(t, Coupon, 'findOneAndUpdate', (f, update, options) => { writes.coupon = options; return query({}); });
  stub(t, CreateShow, 'findByIdAndUpdate', (id, update, options) => { writes.show = [update, options]; return query({}); });
  const signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRETS).update('order_1|pay_1').digest('hex');
  const res = fakeRes();

  await Verifypayment({ USER: { id: 'u1' }, body: { razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_1', razorpay_signature: signature, paymentId: 'p1' } }, res);

  assert.equal(res.code, 200);
  assert.equal(writes.user.session, session);
  assert.equal(writes.coupon.session, session);
  assert.deepEqual(writes.show[0], { $push: { ticketspurchased: 'p1' } });
  assert.equal(writes.show[1].session, session);
  assert.equal(session.ended, true);
});

test('a lost-race refund pays the captured amount once even if the wallet portion cannot be credited', async (t) => {
  const refunds = [];
  stub(t, razorpay.payments, 'refund', async (id, options) => { refunds.push(options.amount); return { id: 'rfnd_1', status: 'pending' }; });
  const creditAttempts = [];
  stub(t, Wallet, 'findOne', () => query({ balance: 0 }));
  stub(t, Wallet, 'findOneAndUpdate', (f, update) => { creditAttempts.push(update.$inc.balance); throw new Error('wallet down'); });
  let recorded;
  stub(t, Payment, 'findOneAndUpdate', (f, update) => { recorded = update; return query({}); });
  stub(t, USER, 'findById', () => query(null));

  await refundLostRaceCharge({ _id: 'p1', amount: 60, walletAmountUsed: 40 }, 'u1', 'pay_1', new Error('sold out'));

  assert.deepEqual(refunds, [6000]);
  // Only the wallet portion was attempted; no fallback credit of 60 + 40
  assert.deepEqual(creditAttempts, [40]);
  assert.equal(recorded.refundId, 'rfnd_1');
  assert.equal(recorded.refundAmount, 60);
});

const escapeRegex = require('../utils/escapeRegex');
const ticketModel = require('../models/ticket');
const { SearchAll } = require('../controllers/common/Showlist');
const { EnhancedFinder } = require('../controllers/Dashboard/EnhancedSearch');
const { TicketDetails } = require('../controllers/Dashboard/OrgainezerDashboard');
const { getTheatreDetails, GetShowsDetails, GetSingleTheatreDetails } = require('../controllers/Dashboard/TheatrereDashboard');
const { FIndusingMOvieTags } = require('../controllers/Dashboard/UserDashboard');
const { RecommendMovies } = require('../controllers/common/Recommend');
const { OrgData } = require('../controllers/Orgainezer/CreateOrg');
const { VerifyOrgainezer } = require('../controllers/Administrator/AdminVerification');
const { CreateTheatres } = require('../controllers/Administrator/CreateTheatres');
const { UpdateTitleImage } = require('../controllers/Orgainezer/CreateTheatreShow');
const { SearchTags } = require('../controllers/Orgainezer/CreateHashtags');
const { UpdateCoupon } = require('../controllers/Administrator/Coupon');
const { finalizeWalletPayment } = require('../controllers/common/Payment');
const genreModel = require('../models/genre');
const bugReportSubmittedTemplate = require('../templates/userTemplates/bugReportSubmittedTemplate');
const updatePasswordTemplate = require('../templates/userTemplates/Updatepasswordtemplate');

// Like query(), but records the argument of every .select() call
const selecting = (value, selects) => {
  const q = query(value);
  q.select = (fields) => { selects.push(fields); return selecting(value, selects); };
  return q;
};

test('search input is matched literally and length-capped', async (t) => {
  assert.equal(escapeRegex('(a+)+$'), '\\(a\\+\\)\\+\\$');
  assert.equal(escapeRegex('x'.repeat(500)).length, 100);

  const filters = [];
  stub(t, CreateShow, 'find', (f) => { filters.push(f); return query([]); });
  stub(t, Theatres, 'find', (f) => { filters.push(f); return query([]); });
  const res = fakeRes();
  await SearchAll({ query: { q: '(a+)+$' } }, res);
  assert.equal(res.code, 200);
  assert.ok(filters.every((f) => (f.title || f.Theatrename).test('(a+)+$')));
  assert.equal(filters[0].title.test('aaaa'), false);

  let theatreFilter;
  Theatres.find = (f) => { theatreFilter = f; return query([]); };
  await EnhancedFinder({ body: { date: '01/01/2030', location: '.*', theatreName: '[' } }, fakeRes());
  assert.equal(theatreFilter.locationName.$regex, '\\.\\*');
  assert.equal(theatreFilter.Theatrename.$regex, '\\[');
});

test('organizers only read ticket data for shows they created', async (t) => {
  const owned = new mongoose.Types.ObjectId();
  stub(t, USER, 'findById', () => query({ showsCreated: [owned] }));
  let filter;
  stub(t, ticketModel, 'findOne', (f) => { filter = f; return query(null); });
  const res = fakeRes();

  await TicketDetails({ USER: { id: 'u1' }, query: { showId: 'someone-elses-show' } }, res);

  assert.equal(res.code, 404);
  assert.deepEqual(filter, { $and: [{ showid: 'someone-elses-show' }, { showid: { $in: [owned] } }] });
});

test('public theatre and movie endpoints only return approved data without internal fields', async (t) => {
  const selects = [];
  const filters = [];
  stub(t, Theatres, 'find', (f) => { filters.push(f); return selecting([{}], selects); });
  stub(t, Theatres, 'findOne', (f) => { filters.push(f); return selecting({ showAlloted: ['s1'] }, selects); });
  stub(t, CreateShow, 'find', (f) => { filters.push(f); return selecting([{}], selects); });
  stub(t, genreModel, 'findOne', () => query({ _id: 'g1' }));

  await getTheatreDetails({ body: { theatre: 'IMAX' } }, fakeRes());
  await GetSingleTheatreDetails({ query: { theatreid: 't1' } }, fakeRes());
  await GetShowsDetails({ query: { Theatreid: 't1' } }, fakeRes());
  await FIndusingMOvieTags({ body: { movies: 'Action' } }, fakeRes());
  await RecommendMovies({ body: { genreId: 'g1' } }, fakeRes());

  const [tags, single, showsTheatre, shows, byTag, recommended] = filters;
  assert.equal(tags.status, 'Approved');
  assert.equal(single.status, 'Approved');
  assert.equal(showsTheatre.status, 'Approved');
  for (const f of [shows, byTag, recommended]) {
    assert.equal(f.uploaded, true);
    assert.equal(f.VerifiedByTheAdmin, true);
  }
  const theatreSelect = selects.find((s) => s.includes('allotments.price'));
  for (const field of ['-allotments.price', '-allotments.ticketsReceived', '-Owner']) assert.ok(theatreSelect.includes(field));
  assert.ok(selects.filter((s) => s.includes('-totalbudget')).length >= 2);
});

test('a public endpoint error responds with 500 instead of hanging', async (t) => {
  stub(t, Theatres, 'findOne', () => { throw new Error('db down'); });
  const res = fakeRes();
  await GetSingleTheatreDetails({ query: { theatreid: 't1' } }, res);
  assert.equal(res.code, 500);
});

test('a locked organizer cannot resubmit, and a rejected one keeps its data until the new one is valid', async (t) => {
  let current;
  stub(t, Orgdata, 'findOne', () => query(current));
  let deleted = 0;
  stub(t, Orgdata, 'findByIdAndDelete', () => { deleted += 1; return query({}); });

  current = { _id: 'o1', status: 'locked', attempts: 3, lockedUntill: new Date(Date.now() + 86400000) };
  const locked = fakeRes();
  await OrgData({ USER: { id: 'u1' }, body: {} }, locked);
  assert.equal(locked.code, 403);

  current = { _id: 'o1', status: 'pending', attempts: 1 };
  const pending = fakeRes();
  await OrgData({ USER: { id: 'u1' }, body: {} }, pending);
  assert.equal(pending.code, 400);

  // Rejected: the resubmission is invalid (no image), so nothing is deleted and attempts survive
  current = { _id: 'o1', status: 'rejected', attempts: 2 };
  const invalid = fakeRes();
  await OrgData({ USER: { id: 'u1' }, body: {} }, invalid);
  assert.equal(invalid.code, 400);
  assert.equal(deleted, 0);
});

test('organizer verification stores the schema enum value and runs validators', async (t) => {
  stub(t, USER, 'findById', () => query({ _id: 'u1', usertype: 'Organizer', orgainezerdata: 'o1', email: 'org@example.com' }));
  stub(t, Orgdata, 'findById', () => query({ _id: 'o1', attempts: 0 }));
  let update;
  stub(t, Orgdata, 'findByIdAndUpdate', (id, u, options) => { update = [u, options]; return query({}); });
  stub(t, USER, 'findByIdAndUpdate', () => query({}));
  stub(t, mailTransport, 'sendMail', async () => ({}));
  const nextYear = new Date().getFullYear() + 1;
  const res = fakeRes();

  await VerifyOrgainezer({ body: { id: 'u1', verify: false, ChangesDate: `01/01/${nextYear}`, ChangesTime: '10:00', verificationStatus: 'REJECTED' } }, res);

  assert.equal(res.code, 200);
  assert.equal(update[0].status, 'rejected');
  assert.equal(update[1].runValidators, true);

  const bad = fakeRes();
  await VerifyOrgainezer({ body: { id: 'u1', verify: false, ChangesDate: `01/01/${nextYear}`, ChangesTime: '10:00', verificationStatus: 'banana' } }, bad);
  assert.equal(bad.code, 400);
});

test('admin theatre creation uses theatresCreated and answers 400 when no image is sent', async (t) => {
  const body = { name: 'N', locationname: 'L', locationurl: 'u', languagename: 'Hindi', theatreformat: 'IMAX', TheatreOwner: 'u1', parking: 'Car' };
  stub(t, USER, 'findOne', () => query({ theatresCreated: 't1' }));
  const already = fakeRes();
  await CreateTheatres({ body }, already);
  assert.equal(already.code, 400);
  assert.match(already.body.message, /already created a theatre/);

  USER.findOne = () => query({});
  const noFiles = fakeRes();
  await CreateTheatres({ body }, noFiles);
  assert.equal(noFiles.code, 400);
  assert.equal(noFiles.body.message, 'no images uploaded');
});

test('uploads without a file get a 400, and tag search reads the GET query string', async (t) => {
  const res = fakeRes();
  await UpdateTitleImage({ query: { id: 's1' }, USER: { id: 'u1' } }, res);
  assert.equal(res.code, 400);

  let filter;
  stub(t, hashtags, 'find', (f) => { filter = f; return query([]); });
  const search = fakeRes();
  await SearchTags({ USER: { id: 'u1' }, query: { name: 'action' }, body: {} }, search);
  assert.equal(search.code, 200);
  assert.deepEqual(filter, { name: 'action', userid: 'u1' });
});

test('coupon updates are whitelisted, validated, and a percentage cannot exceed 100', async (t) => {
  stub(t, Coupon, 'findById', () => query({ _id: 'c1', discountType: 'percentage', discountValue: 10 }));
  stub(t, USER, 'findById', () => query(null));
  const updates = [];
  stub(t, Coupon, 'findByIdAndUpdate', (id, u, options) => { updates.push([u, options]); return query({ code: 'X' }); });

  const tooBig = fakeRes();
  await UpdateCoupon({ body: { couponId: 'c1', discountValue: 500 } }, tooBig);
  assert.equal(tooBig.code, 400);
  const zero = fakeRes();
  await UpdateCoupon({ body: { couponId: 'c1', discountType: 'flat', discountValue: 0 } }, zero);
  assert.equal(zero.code, 400);
  assert.equal(updates.length, 0);

  const ok = fakeRes();
  await UpdateCoupon({ body: { couponId: 'c1', isActive: false, usedCount: 0, usedBy: [], createdBy: 'x', $where: '1' } }, ok);
  assert.equal(ok.code, 200);
  assert.deepEqual(updates[0][0], { isActive: false });
  assert.equal(updates[0][1].runValidators, true);
});

test('a wallet-only booking can be cancelled and its wallet amount comes back once', async (t) => {
  const inTenDays = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const Showdate = `${String(inTenDays.getDate()).padStart(2, '0')}/${String(inTenDays.getMonth() + 1).padStart(2, '0')}/${inTenDays.getFullYear()}`;
  const booking = { _id: 'p1', userid: 'u1', Payment_Status: 'success', razorpay_order_id: 'wallet_1', Showdate, time: '18:00', amount: 0, walletAmountUsed: 150, ticketCategorey: [] };
  stub(t, Payment, 'findById', () => query(booking));
  stub(t, Payment, 'findOneAndUpdate', () => query({ ...booking, cancelled: true, save: async () => {} }));
  stub(t, mongoose, 'startSession', async () => ({ startTransaction() {}, async commitTransaction() {}, async abortTransaction() {}, endSession() {} }));
  let bankRefunds = 0;
  stub(t, razorpay.payments, 'refund', async () => { bankRefunds += 1; });
  const credits = recordCredits(t);
  stub(t, Notification, 'create', async () => ({ toObject: () => ({}) }));
  stub(t, USER, 'findById', () => query(null));
  const res = fakeRes();

  await CancelTicket({ USER: { id: 'u1' }, body: { paymentId: 'p1', refundToWallet: false } }, res);

  assert.equal(res.code, 200);
  assert.deepEqual(credits, [150]);
  assert.equal(bankRefunds, 0);
  assert.equal(res.body.data.refundId, 'wallet');
});

test('a finalized wallet booking is recorded on the show inside the transaction', async (t) => {
  const session = { startTransaction() {}, async commitTransaction() {}, async abortTransaction() {}, async endSession() {} };
  stub(t, mongoose, 'startSession', async () => session);
  stub(t, Payment, 'findOneAndUpdate', () => query({ _id: 'p1', showid: 's1', ticketid: 't1', ticketCategorey: [], walletAmountUsed: 0 }));
  stub(t, Theatrestickets, 'updateOne', () => query({}));
  stub(t, USER, 'findByIdAndUpdate', () => query({}));
  stub(t, Notification, 'create', async () => ({ toObject: () => ({}) }));
  let showWrite;
  stub(t, CreateShow, 'findByIdAndUpdate', (id, update, options) => { showWrite = [id, update, options]; return query({}); });

  await finalizeWalletPayment('p1', 'u1');

  assert.deepEqual(showWrite.slice(0, 2), ['s1', { $push: { ticketspurchased: 'p1' } }]);
  assert.equal(showWrite[2].session, session);
});

test('email templates escape user-supplied values and encode the reset token', () => {
  const html = bugReportSubmittedTemplate('BUG-1', '<script>alert(1)</script>', '<img src=x onerror=alert(1)>', '"Eve"');
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;script&gt;'));
  const reset = updatePasswordTemplate('a@example.com', 'abc"><x');
  assert.ok(reset.includes('https://mw-bay.vercel.app/abc%22%3E%3Cx'));
  assert.ok(!reset.includes('abc"><x'));
});
