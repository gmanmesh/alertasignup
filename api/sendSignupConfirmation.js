import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, html} = req.body;
  // Create OAuth2 transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.SENDER_EMAIL2,
      clientId: process.env.GOOGLE_CLIENT_ID2,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET2,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN2,
    },
    tls: {
    rejectUnauthorized: false, // disabling SSL validation if needed
  },
    debug: true,
    logger: true,
  });

  // Email details
  const mailOptions = {
    from:SENDER_EMAIL,
    to:to,
    subject: 'Welcome to Alerta - Your Phone Security App',
    html: html,
  };

  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Welcome email sent', messageId: info.messageId });
  } catch (err) {
    console.error('Error sending welcome email:', err);
    res.status(500).json({ error: err.message || 'Failed to send email' });
  }
}
