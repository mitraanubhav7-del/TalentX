import nodemailer from 'nodemailer';

export async function sendVerificationCode({ email, code, purpose }) {
  const emailUser = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (!emailUser || !appPassword) {
    throw new Error('Email OTP delivery is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: emailUser, pass: appPassword },
  });
  const action = purpose === 'signup' ? 'verify your email address' : 'reset your password';

  try {
    await transporter.sendMail({
      from: `"TalentX" <${emailUser}>`,
      to: email,
      subject: `Your TalentX ${purpose === 'signup' ? 'verification' : 'password reset'} code`,
      text: `Your TalentX code to ${action} is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
      html: `<p>Your TalentX code to ${action} is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:5px">${code}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
    });
  } catch (cause) {
    const error = new Error('TalentX could not send the email code. Check the Gmail sender and App Password configuration.', { cause });
    error.status = 503;
    error.publicMessage = error.message;
    throw error;
  }
}
