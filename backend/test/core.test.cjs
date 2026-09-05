const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.JWT_PRIVATE_KEY = 'backend-test-secret';

const { signPaymentId, generateTicketQrDataUrl } = require('../utils/generateTicketQr');
const { auth } = require('../middlewares/verification');

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
