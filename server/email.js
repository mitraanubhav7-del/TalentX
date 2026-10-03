const BREVO_EMAIL_API = 'https://api.brevo.com/v3/smtp/email';

export async function sendVerificationCode(
  { email, code, purpose },
  { env = process.env, fetchImpl = fetch } = {},
) {
  const apiKey = env.BREVO_API_KEY;
  const senderEmail = env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) {
    throw new Error('Email OTP delivery is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.');
  }

  const action = purpose === 'signup' ? 'verify your email address' : 'reset your password';

  try {
    const response = await fetchImpl(BREVO_EMAIL_API, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'TalentX', email: senderEmail },
        to: [{ email }],
        subject: `Your TalentX ${purpose === 'signup' ? 'verification' : 'password reset'} code`,
        textContent: `Your TalentX code to ${action} is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
        htmlContent: `<p>Your TalentX code to ${action} is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:5px">${code}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Brevo email API returned HTTP ${response.status}.`);
    }
  } catch (cause) {
    const error = new Error('TalentX could not send the email code. Check the Brevo API key and verified sender configuration.', { cause });
    error.status = 503;
    error.publicMessage = error.message;
    throw error;
  }
}
