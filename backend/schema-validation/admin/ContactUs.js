exports.listContactUs = {
  start: {
    in: ['query'],
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: 'Start must be a non-negative integer',
    },
    toInt: true,
  },
  limit: {
    in: ['query'],
    optional: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: 'Limit must be between 1 and 100',
    },
    toInt: true,
  },
  search: {
    in: ['query'],
    optional: true,
    trim: true,
    isString: {
      errorMessage: 'Search must be a string',
    },
  },
  orderBy: {
    in: ['query'],
    optional: true,
    isString: {
      errorMessage: 'Order by must be a string',
    },
    isIn: {
      options: [['firstName', 'lastName', 'email', 'createdAt']],
      errorMessage:
        'Order by must be one of: firstName, lastName, email, createdAt',
    },
  },
  orderDirection: {
    in: ['query'],
    optional: true,
    isString: {
      errorMessage: 'Order direction must be a string',
    },
    isIn: {
      options: [['ASC', 'DESC', 'asc', 'desc']],
      errorMessage: 'Order direction must be ASC or DESC',
    },
  },
};
