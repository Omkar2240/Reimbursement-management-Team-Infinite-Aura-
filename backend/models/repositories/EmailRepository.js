const { emailSubjects, emailTemplate } = require('../../config/options');
const { triggerEmail } = require('../helpers/EmailHelper');
const { generateHtml } = require('../helpers/UtilHelper');

exports.sendResetPasswordOTPEmail = async (data) => {
  let htmlContent = generateHtml(
    'reset-password-otp-email',
    emailTemplate['reset-password-otp-email'](data)
  );
  await triggerEmail({
    to: data.email,
    subject: emailSubjects.ACCOUNT_PASSWORD_RESET,
    html: htmlContent,
    attachments: [],
  });
};

exports.sendVerificationOTPEmail = async (data) => {
  let htmlContent = generateHtml(
    'email-otp-verification',
    emailTemplate['email-otp-verification'](data)
  );
  await triggerEmail({
    to: data.email,
    subject: emailSubjects.EMAIL_VERIFICATION_OTP,
    html: htmlContent,
    attachments: [],
  });
};

exports.sendContactUsEmail = async (data) => {
  let htmlContent = generateHtml(
    'contact-us-email',
    emailTemplate['contact-us-email'](data)
  );
  await triggerEmail({
    to: process.env.MAIL_SMTP_FROM,
    subject: `[Contact Us] ${data.subject}`,
    html: htmlContent,
    attachments: [],
  });
};

exports.sendWelcomeSignupEmail = async (data) => {
  let htmlContent = generateHtml(
    'welcome-signup-email',
    emailTemplate['welcome-signup-email'](data)
  );
  await triggerEmail({
    to: data.email,
    subject: 'Welcome to FlowExpense - Smart Reimbursement Engine!',
    html: htmlContent,
    attachments: [],
  });
};
