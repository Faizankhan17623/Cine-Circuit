const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const mongoose = require('mongoose');
require('dotenv').config();

const baseUrl = (process.env.INTEGRATION_TEST_BASE_URL || '').replace(/\/$/, '');
// Never point an integration test at the application's development database
// implicitly. A test database must be selected explicitly.
const mongoUri = process.env.MONGODB_TEST_URI;
const webhookSecret = process.env.RAZORPAY_HEADERS;

test('MongoDB test database is reachable', { skip: !mongoUri }, async () => {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  try {
    const result = await mongoose.connection.db.admin().ping();
    assert.equal(result.ok, 1);
  } finally {
    await mongoose.disconnect();
  }
});

test('API documentation endpoint is reachable', { skip: !baseUrl }, async () => {
  const response = await fetch(`${baseUrl}/api/docs/`);
  assert.equal(response.status, 200);
});

test('webhook rejects an invalid signature', { skip: !baseUrl }, async () => {
  const response = await fetch(`${baseUrl}/api/v1/Payment/Webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'X-Razorpay-Signature': 'invalid' },
    body: JSON.stringify({ event: 'payment.captured' }),
  });
  assert.equal(response.status, 400);
});

test('webhook accepts a signed event with no matching payment as ignored', { skip: !baseUrl || !webhookSecret }, async () => {
  const body = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: {} } } });
  const signature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
  const response = await fetch(`${baseUrl}/api/v1/Payment/Webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'X-Razorpay-Signature': signature },
    body,
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ignored, true);
});
