const nodemailer = require("nodemailer");

async function sendMail(subject, message) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"UPSDC Monitor" <${process.env.SMTP_USER}>`,
    to: process.env.ALERT_EMAIL,
    subject,
    text: message
  });
}

module.exports = sendMail;
