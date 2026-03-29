const createCompany = {
  name: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Company name cannot be empty',
    isString: {
      errorMessage: 'Company name must be string',
    },
  },
  country: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Country cannot be empty',
    isString: {
      errorMessage: 'Country must be string',
    },
  },
  currencyCode: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Currency code cannot be empty',
    isString: {
      errorMessage: 'Currency code must be string',
    },
  },
  adminUserId: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: 'adminUserId must be integer',
    },
  },
};

const updateCompany = {
  name: {
    in: ['body'],
    optional: true,
    trim: true,
    isString: {
      errorMessage: 'Company name must be string',
    },
  },
  country: {
    in: ['body'],
    optional: true,
    trim: true,
    isString: {
      errorMessage: 'Country must be string',
    },
  },
  currencyCode: {
    in: ['body'],
    optional: true,
    trim: true,
    isString: {
      errorMessage: 'Currency code must be string',
    },
  },
};

module.exports = {
  createCompany,
  updateCompany,
};
