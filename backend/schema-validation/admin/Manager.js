const { accessManagementType } = require('../../config/options');

const accessManagement = {
  accessManagement: {
    in: ['body'],
    notEmpty: false,
    errorMessage: 'Access Management cannot be empty',
  },
  'accessManagement.*.category': {
    in: ['body'],
    trim: true,
    notEmpty: false,
    errorMessage: 'Category cannot be empty',
    isIn: {
      options: [Object.values(accessManagementType)],
      errorMessage: `Category value must be ${Object.values(accessManagementType).join(', ')}`,
    },
    custom: {
      options: (value) =>
        Object.values(accessManagementType).includes(
          String(value).toLowerCase()
        ),
      errorMessage: `Category value must be ${Object.values(accessManagementType).join(', ')}`,
    },
    isString: {
      errorMessage: 'Category must be string',
    },
  },
  'accessManagement.*.canView': {
    in: ['body'],
    notEmpty: false,
  },
  'accessManagement.*.canEdit': {
    in: ['body'],
    notEmpty: false,
  },
  'accessManagement.*.canAdd': {
    in: ['body'],
    notEmpty: false,
  },
  'accessManagement.*.canDelete': {
    in: ['body'],
    notEmpty: false,
  },
};

const createAdmin = {
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
    notEmpty: false,
    isString: {
      errorMessage: 'Last name must be string',
    },
  },
  profilePicture: {
    in: ['body'],
    trim: true,
    notEmpty: false,
    isString: {
      errorMessage: 'profilePicture must be string',
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
  mobileNumber: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Mobile number cannot be empty',
    isString: {
      errorMessage: 'Mobile number must be string',
    },
  },
  ...accessManagement,
};

const updateAdmin = {
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
    notEmpty: false,
    isString: {
      errorMessage: 'Last name must be string',
    },
  },
  profilePicture: {
    in: ['body'],
    trim: true,
    notEmpty: false,
    isString: {
      errorMessage: 'Profile picture must be string',
    },
  },
  ...accessManagement,
};

const changePassword = {
  password: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Password cannot be empty',
  },
  confirmPassword: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Confirm Password cannot be empty',
    custom: {
      options: (value, { req }) =>
        req.body.confirmPassword === req.body.password,
      errorMessage: 'Confirm Password does not match',
    },
  },
};

module.exports = {
  createAdmin,
  updateAdmin,
  changePassword,
};
