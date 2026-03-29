exports.passwordLogin = {
  email: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Field cannot be empty',
    isString: {
      errorMessage: 'Field must be string',
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

exports.sendOtp = {
  type: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Type cannot be empty',
    isIn: {
      options: [['email', 'mobileNumber']],
      errorMessage: `Type value must be email or mobileNumber`,
    },
    isString: {
      errorMessage: 'Type must be string',
    },
  },
  countryCode: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type !== 'email',
      else: (value) => false,
    },
    errorMessage: 'Country code cannot be empty',
    isString: {
      errorMessage: 'Country code must be string',
    },
    customSanitizer: {
      options: (value, { req, location, path }) => {
        return value.charAt(0) === '+'
          ? value.substring(1, value.length)
          : value;
      },
    },
  },
  mobileNumber: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type !== 'email',
      else: (value) => false,
    },
    errorMessage: 'Mobile number cannot be empty',
    isString: {
      errorMessage: 'Mobile number must be string',
    },
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type === 'email',
      else: (value) => false,
    },
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

exports.verifyOtp = {
  type: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Type cannot be empty',
    isIn: {
      options: [['email', 'mobileNumber']],
      errorMessage: `Type value must be email or mobileNumber`,
    },
    isString: {
      errorMessage: 'Type must be string',
    },
  },
  otp: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'OTP cannot be empty',
    isInt: {
      errorMessage: 'OTP must be integer',
    },
  },
  countryCode: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type !== 'email',
      else: (value) => false,
    },
    errorMessage: 'Country code cannot be empty',
    isString: {
      errorMessage: 'Country code must be string',
    },
    customSanitizer: {
      options: (value, { req, location, path }) => {
        return value.charAt(0) === '+'
          ? value.substring(1, value.length)
          : value;
      },
    },
  },
  mobileNumber: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type !== 'email',
      else: (value) => false,
    },
    errorMessage: 'Mobile number cannot be empty',
    isString: {
      errorMessage: 'Mobile number must be string',
    },
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type === 'email',
      else: (value) => false,
    },
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

exports.updateInfo = {
  firstName: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'First name cannot be empty',
    isString: {
      errorMessage: 'First name must be string',
    },
  },
  lastName: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Last name cannot be empty',
    isString: {
      errorMessage: 'Last name must be string',
    },
  },
  profilePicture: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => !!req.body.profilePicture,
      else: (value) => false,
    },
  },
  state: {
    in: ['body'],
    trim: true,
    notEmpty: false,
    errorMessage: 'State cannot be empty',
    isString: {
      errorMessage: 'State must be string',
    },
  },
  pincode: {
    in: ['body'],
    trim: true,
    notEmpty: false,
    errorMessage: 'Pincode cannot be empty',
    isString: {
      errorMessage: 'Pincode must be string',
    },
  },
};
exports.signUp = {
  countryCode: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Country code cannot be empty',
    isString: {
      errorMessage: 'Country code must be string',
    },
    customSanitizer: {
      options: (value, { req, location, path }) => {
        return value.charAt(0) === '+'
          ? value.substring(1, value.length)
          : value;
      },
    },
  },
  mobileNumber: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Mobile number cannot be empty',
    isString: {
      errorMessage: 'Mobile number must be string',
    },
  },
  firstName: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'First name cannot be empty',
    isString: {
      errorMessage: 'First name must be string',
    },
  },
  lastName: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Last name cannot be empty',
    isString: {
      errorMessage: 'Last name must be string',
    },
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Email cannot be empty',
    isString: {
      errorMessage: 'Email must be string',
    },
  },
  referralCode: {
    in: ['body'],
    trim: true,
    optional: true,
    isString: {
      errorMessage: 'Referral code must be string',
    },
  },
};
exports.sendOtpToEmail = {
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
exports.updatePasswordWithOtpEmail = {
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

exports.generatePassword = {
  confirmPassword: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'confirm password cannot be empty',
    isString: {
      errorMessage: 'Confirm password must be string',
    },
    custom: {
      options: (value, { req }) =>
        req.body.confirmPassword === req.body.password,
      errorMessage: 'confirm password does not match',
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
exports.changePassword = {
  newPassword: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'New password cannot be empty',
  },
  currentPassword: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Current password cannot be empty',
  },
  confirmPassword: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'confirm password cannot be empty',
    custom: {
      options: (value, { req }) =>
        req.body.newPassword === req.body.confirmPassword,
      errorMessage: 'confirm password does not match',
    },
  },
};
const emailMobile = {
  type: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Type cannot be empty',
    isIn: {
      options: [['email', 'mobileNumber']],
      errorMessage: `Type value must be email or mobileNumber`,
    },
    isString: {
      errorMessage: 'Type must be string',
    },
  },
  countryCode: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type !== 'email',
      else: (value) => false,
    },
    errorMessage: 'Country code cannot be empty',
    isString: {
      errorMessage: 'Country code must be string',
    },
    customSanitizer: {
      options: (value, { req, location, path }) => {
        return value.charAt(0) === '+'
          ? value.substring(1, value.length)
          : value;
      },
    },
  },
  mobileNumber: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type !== 'email',
      else: (value) => false,
    },
    errorMessage: 'Mobile number cannot be empty',
    isString: {
      errorMessage: 'Mobile number must be string',
    },
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      if: (value, { req, location, path }) => req.body.type === 'email',
      else: (value) => false,
    },
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
exports.addEmailMobileNumber = {
  ...emailMobile,
  password: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Password cannot be empty',
  },
};
exports.markPrimary = {
  ...emailMobile,
  password: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Password cannot be empty',
  },
};

exports.sso = {
  ssoProvider: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'sso provider cannot be empty',
    },
    isIn: {
      options: [['google']],
      errorMessage: `SSO Provider value must be 'google'`,
    },
  },
  googleId: {
    in: ['body'],
    trim: true,
    custom: {
      options: (value, { req }) => {
        if (req.body.ssoProvider === 'google') {
          if (!value) {
            throw new Error(
              'Google id cannot be empty when ssoProvider is google'
            );
          }
        } else if (value) {
          throw new Error(
            'Google id must be empty unless ssoProvider is google'
          );
        }
        return true;
      },
    },
  },
  idToken: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Id token cannot be empty',
    },
  },
  firstName: {
    in: ['body'],
    trim: true,
    optional: true,
  },
  lastName: {
    in: ['body'],
    trim: true,
    optional: true,
  },
  email: {
    in: ['body'],
    trim: true,
    optional: { options: { nullable: true } },
    isString: {
      errorMessage: 'Type must be string',
    },
  },
};
