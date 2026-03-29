const nodeMailer = require('nodemailer');
const { emailSenderName } = require('../../config/options');

exports.triggerEmail = ({ to, subject, text, html, attachments = [], cc }) => {
  try {
    if (['local', 'development', 'test'].includes(process.env.NODE_ENV)) {
      return;
    }
    html = html || '';
    if (!to) return;
    return new Promise((resolve, reject) => {
      const transporter = nodeMailer.createTransport({
        auth: {
          user: process.env.MAIL_SMTP_USERNAME,
          pass: process.env.MAIL_SMTP_PASSWORD,
        },
        host: process.env.MAIL_SMTP_HOST,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
        },
      });
      const mailOptions = {
        from: `"${emailSenderName}" <${process.env.MAIL_SMTP_FROM}>`,
        to: to,
        ...(cc && {
          cc: cc,
        }),
        subject: subject,
        text: text,
        html: html,
        attachments,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        console.log('info', info);
        console.error('error', error);
        if (error) {
          reject(error);
        }
        resolve(info);
      });
    });
  } catch (error) {
    customErrorLogger(error);
  }
};
