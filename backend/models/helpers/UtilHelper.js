const pug = require('pug');
const bcrypt = require('bcryptjs');
const { parsePhoneNumber } = require('awesome-phonenumber');

// Generate a standardized response
exports.genRes = (code, payload, type = 'unknown', noWrapPayload = false) => {
  // Handle error cases (code >= 300)
  if (code >= 300) {
    // Normalize payload to array
    const payloadArray = Array.isArray(payload) ? payload : [payload];

    // Separate plain strings and object errors
    const plainTextErrors = payloadArray.filter(
      (item) => typeof item === 'string'
    );
    const objectErrors = payloadArray.filter(
      (item) => typeof item === 'object' && !Array.isArray(item)
    );

    return {
      error: {
        errors: plainTextErrors,
        errorParams: objectErrors,
        code,
        type,
      },
    };
  }

  // For success responses:
  if (payload) {
    return noWrapPayload ? payload : { result: payload };
  }

  return undefined;
};

exports.generateCloudFrontUrl = (filePath) => {
  if (filePath) {
    return `${process.env.CDN_WEB_STATIC}/${filePath}`;
  }
  return '';
};

exports.getUploadsPath = (file) => `uploads/${file.split('uploads/')[1]}`;

exports.genOtp = () => {
  if (['development', 'uat', 'test'].includes(process.env.NODE_ENV)) {
    return 5555;
  }
  return Math.floor(1000 + Math.random() * 9000);
};
exports.getIp = (req) => req.headers.ipAddress || req.headers.ipaddress;

exports.getCountryNameFromCode = (countryCode) =>
  new Intl.DisplayNames(['en'], {
    type: 'region',
  }).of(countryCode);

exports.parseMobileNumber = (mobileNumber) => parsePhoneNumber(mobileNumber);

exports.generatePassword = async (password) =>
  await bcrypt.hash(password, bcrypt.genSaltSync(8));

exports.shuffleArray = (array) => {
  const arr = array.slice(); // clone array to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap elements
  }
  return arr;
};

exports.generateHtml = (template, data) => {
  return pug.renderFile(`${__dirname}/../../templates/${template}.pug`, data);
};
