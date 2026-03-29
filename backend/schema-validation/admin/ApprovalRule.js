const { usersRoles } = require('../../config/options');

const allowedRoles = [
  usersRoles.MANAGER,
  usersRoles.ADMIN,
  usersRoles.SUPER_ADMIN,
  usersRoles.EMPLOYEE,
  'FINANCE',
  'DIRECTOR',
  'CFO',
];

const createRule = {
  companyId: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'companyId cannot be empty',
    isInt: {
      errorMessage: 'companyId must be integer',
    },
  },
  stepNumber: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'stepNumber cannot be empty',
    isInt: {
      options: { min: 1 },
      errorMessage: 'stepNumber must be integer and >= 1',
    },
  },
  approverRole: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'approverRole cannot be empty',
    isIn: {
      options: [allowedRoles],
      errorMessage: `approverRole must be one of: ${allowedRoles.join(', ')}`,
    },
  },
  percentageThreshold: {
    in: ['body'],
    optional: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: 'percentageThreshold must be between 1 and 100',
    },
  },
  isManagerApprover: {
    in: ['body'],
    optional: true,
    isBoolean: {
      errorMessage: 'isManagerApprover must be boolean',
    },
  },
  allowCfoShortcut: {
    in: ['body'],
    optional: true,
    isBoolean: {
      errorMessage: 'allowCfoShortcut must be boolean',
    },
  },
};

const updateRule = {
  stepNumber: createRule.stepNumber,
  approverRole: createRule.approverRole,
  percentageThreshold: createRule.percentageThreshold,
  isManagerApprover: createRule.isManagerApprover,
  allowCfoShortcut: createRule.allowCfoShortcut,
  isActive: {
    in: ['body'],
    optional: true,
    isBoolean: {
      errorMessage: 'isActive must be boolean',
    },
  },
};

module.exports = {
  createRule,
  updateRule,
};
