const { emailTemplate } = require('../../../config/options');
const sampleData = {
  'reset-password-otp-email': {
    name: 'Rakesh',
    tempOtp: 12345,
  },
  'email-otp-verification': {
    name: 'Rakesh',
    tempOtp: 12345,
  },
  'contact-us-email': {
    name: 'Rakesh',
    email: 'rakesh@gmail.com',
    phone: '9876543210',
    subject: 'Test Subject',
    message: 'Test Message',
  },
  'welcome-signup-email': {
    name: 'Rakesh Kumar',
    email: 'rakesh@gmail.com',
    joinDate: new Date().toLocaleDateString(),
  },
};

exports.render = (req, res) => {
  let data = sampleData[req.params.type];
  let payload = emailTemplate[req.params.type](data);
  return res.render(req.params.type, payload);
};
