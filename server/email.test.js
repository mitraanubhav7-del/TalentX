import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sendVerificationCode } from './email.js';

const emailConfig = {
  BREVO_API_KEY: 'test-api-key',
  BREVO_SENDER_EMAIL: 'verified@example.com',
};

test('sends OTP email through Brevo HTTPS API', async () => {
  let request;
  await sendVerificationCode({
    email: 'candidate@example.com',
    code: '123456',
    purpose: 'signup',
  }, {
    env: emailConfig,
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, status: 201 };
    },
  });

  assert.equal(request.url, 'https://api.brevo.com/v3/smtp/email');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['api-key'], emailConfig.BREVO_API_KEY);
  assert.deepEqual(JSON.parse(request.options.body), {
    sender: { name: 'TalentX', email: 'verified@example.com' },
    to: [{ email: 'candidate@example.com' }],
    subject: 'Your TalentX verification code',
    textContent: 'Your TalentX code to verify your email address is 123456. It expires in 10 minutes. If you did not request this, you can ignore this email.',
    htmlContent: '<p>Your TalentX code to verify your email address is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:5px">123456</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>',
  });
});

test('reports Brevo API failures without hiding delivery errors', async () => {
  await assert.rejects(sendVerificationCode({
    email: 'candidate@example.com',
    code: '123456',
    purpose: 'reset',
  }, {
    env: emailConfig,
    fetchImpl: async () => ({ ok: false, status: 401 }),
  }), error => {
    assert.equal(error.status, 503);
    assert.equal(error.publicMessage, 'TalentX could not send the email code. Check the Brevo API key and verified sender configuration.');
    assert.match(error.cause.message, /HTTP 401/);
    return true;
  });
});

test('rejects missing Brevo configuration', async () => {
  await assert.rejects(sendVerificationCode({
    email: 'candidate@example.com',
    code: '123456',
    purpose: 'signup',
  }, { env: {} }), /Set BREVO_API_KEY and BREVO_SENDER_EMAIL/);
});
