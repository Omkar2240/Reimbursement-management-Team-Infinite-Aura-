const emailLogin = {
  email: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Email cannot be empty',
    isString: {
      errorMessage: 'Email must be string',
    },
  },
  password: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Password cannot be empty',
    isString: {
      errorMessage: 'Password must be string',
    },
  },
};

const sendOtpToEmail = {
  email: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Email cannot be empty',
    isString: {
      errorMessage: 'Email must be string',
    },
    isEmail: {
      bail: true,
      errorMessage: 'Enter a valid Email',
    },
  },
};

const updatePasswordWithOtpEmail = {
  email: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Email cannot be empty',
    isString: {
      errorMessage: 'Email must be string',
    },
    isEmail: {
      bail: true,
      errorMessage: 'Enter a valid Email',
    },
  },
  tempOtp: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'Temp OTP cannot be empty',
    isInt: {
      errorMessage: 'Temp OTP must be integer',
    },
  },
  password: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'Password cannot be empty',
    isString: {
      errorMessage: 'Password must be string',
    },
  },
};
const updateAdmin = {
  countryCode: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'Country code must be string',
    },
  },
  mobileNumber: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'Mobile number must be string',
    },
  },
  email: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'Email must be string',
    },
  },
  firstName: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'First name must be string',
    },
  },
  lastName: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'Last name must be string',
    },
  },
  country: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'Country must be string',
    },
  },
  currencyCode: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'currencyCode must be string',
    },
  },
};
module.exports = {
  updateAdmin,
  emailLogin,
  sendOtpToEmail,
  updatePasswordWithOtpEmail,
};
