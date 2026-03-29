exports.contactUs = {
  firstName: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'First name cannot be empty',
    isString: {
      errorMessage: 'First name must be a string',
    },
    isLength: {
      options: { max: 50 },
      errorMessage: 'First name must be at most 50 characters',
    },
  },
  lastName: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Last name cannot be empty',
    isString: {
      errorMessage: 'Last name must be a string',
    },
    isLength: {
      options: { max: 50 },
      errorMessage: 'Last name must be at most 50 characters',
    },
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Email cannot be empty',
    isEmail: {
      errorMessage: 'Please enter a valid email address',
    },
    normalizeEmail: true,
  },
  mobileNumber: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Mobile number cannot be empty',
    isString: {
      errorMessage: 'Mobile number must be a string',
    },
    matches: {
      options: /^[+\d][\d\s\-().]{6,19}$/,
      errorMessage: 'Please enter a valid mobile number',
    },
  },
  message: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Message cannot be empty',
    isString: {
      errorMessage: 'Message must be a string',
    },
    isLength: {
      options: { min: 10, max: 1000 },
      errorMessage: 'Message must be between 10 and 1000 characters',
    },
  },
};
