const test = require('node:test');
const assert = require('node:assert/strict');

const {
  isValidContactPayload,
  spamScore,
  isSpam,
} = require('../api/lib/spam-protection.cjs');

const validPayload = {
  name: 'Ava Niyoga',
  email: 'ava@example.com',
  message: 'Hello! I am interested in retreat dates and accommodations for June.',
};

test('accepts a valid contact payload', () => {
  assert.equal(isValidContactPayload(validPayload), true);
  assert.equal(isSpam(validPayload), false);
});

test('rejects malformed payloads', () => {
  assert.equal(isValidContactPayload({ ...validPayload, email: 'bad-email' }), false);
  assert.equal(isValidContactPayload({ ...validPayload, message: 'Too short' }), false);
});

test('flags honeypot and link-heavy spam', () => {
  const spamPayload = {
    ...validPayload,
    message: 'Visit http://spam.example now and https://spam2.example for crypto tips',
    website: 'filled-by-bot',
    formStartTime: Date.now(),
  };

  assert.ok(spamScore(spamPayload) >= 5);
  assert.equal(isSpam(spamPayload), true);
});

test('flags obvious repeated-character spam', () => {
  const spamPayload = {
    ...validPayload,
    message: 'looooooooook!!!!!!!!! best offer ever!!!!!',
  };

  assert.equal(isSpam(spamPayload), true);
});
