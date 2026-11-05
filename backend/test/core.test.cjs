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
