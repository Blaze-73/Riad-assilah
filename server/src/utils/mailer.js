import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendInquiryNotification(inquiry) {
  const text = `
New Booking Request
--------------------------------
Name: ${inquiry.guestName}
Email: ${inquiry.email}
Check-in: ${inquiry.checkIn || 'Not specified'}
Check-out: ${inquiry.checkOut || 'Not specified'}
Guests: ${inquiry.guests || 'Not specified'}
Message: ${inquiry.message || 'No message'}
  `.trim();

  try {
    await transporter.sendMail({
      from: '"Riad Asilah" <noreply@riadasilah.com>',
      to: process.env.NOTIFICATION_EMAIL || 'riad.asilah@example.com',
      subject: `New booking from ${inquiry.guestName}`,
      text
    });
  } catch (err) {
    console.warn('Email notification failed:', err.message);
  }
}
