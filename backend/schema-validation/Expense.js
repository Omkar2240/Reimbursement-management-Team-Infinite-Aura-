exports.createExpense = {
  title: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Title cannot be empty',
    isString: {
      errorMessage: 'Title must be string',
    },
  },
  amount: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'Amount cannot be empty',
    isFloat: {
      options: { gt: 0 },
      errorMessage: 'Amount must be a positive number',
    },
  },
  currency: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Currency cannot be empty',
    isString: {
      errorMessage: 'Currency must be string',
    },
  },
  category: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Category cannot be empty',
    isString: {
      errorMessage: 'Category must be string',
    },
  },
  date: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'Date cannot be empty',
    isISO8601: {
      errorMessage: 'Date must be ISO8601 format',
    },
  },
  description: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Description must be string',
    },
  },
};

exports.rejectExpense = {
  reason: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Reason must be string',
    },
  },
  comments: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'comments must be string',
    },
  },
};
