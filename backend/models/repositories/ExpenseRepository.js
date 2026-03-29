const { Expense, ApprovalRule, ExpenseApproval, User } = require('..');
const sequelize = require('sequelize');
const {
  errorMessage,
  successMessage,
  usersRoles,
  defaultStatus,
} = require('../../config/options');
const { Op } = sequelize;
const { convertCurrency } = require('../helpers/CurrencyHelper');

const fallbackApprovalChain = [usersRoles.MANAGER, 'FINANCE', 'DIRECTOR'];

const normalizeRole = (role) => (role ? String(role).toUpperCase() : null);

const getRulesForExpense = async (expense) => {
  const rules = await ApprovalRule.findAll({
    where: {
      companyId: expense.companyId,
      isActive: true,
      status: { [Op.ne]: defaultStatus.DELETED },
    },
    order: [['stepNumber', 'ASC']],
  });

  if (rules.length) return rules;

  return fallbackApprovalChain.map((approverRole, index) => ({
    id: null,
    stepNumber: index + 1,
    approverRole,
    approverUserId: null,
    isManagerApprover: approverRole === usersRoles.MANAGER,
    percentageThreshold: null,
    allowCfoShortcut: false,
  }));
};

const getCurrentRule = (rules, approvalStep) =>
  rules.find((rule) => Number(rule.stepNumber) === Number(approvalStep)) ||
  rules[Math.max(Number(approvalStep) - 1, 0)] ||
  null;

const canUserApproveRule = async (expense, rule, currentUser) => {
  const currentRole = normalizeRole(currentUser.role);
  const ruleRole = normalizeRole(rule?.approverRole);

  if (!rule) return { allowed: false, reason: 'Approval rule not found' };

  if (rule.approverUserId && Number(rule.approverUserId) === Number(currentUser.id)) {
    return { allowed: true };
  }

  if (rule.isManagerApprover) {
    const expenseOwner = await User.findOne({
      where: { id: expense.userId },
      attributes: ['id', 'parentId'],
    });
    if (!expenseOwner || !expenseOwner.parentId) {
      return {
        allowed: false,
        reason: 'No manager assigned to employee for manager-approver rule',
      };
    }
    if (Number(expenseOwner.parentId) === Number(currentUser.id)) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Current approval is pending with assigned manager' };
  }

  if (ruleRole && currentRole === ruleRole) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Current approval is pending with ${ruleRole || 'configured approver'}`,
  };
};

const getExpensesByUser = async (user) => {
  const role = normalizeRole(user.role);
  let where = { status: { [Op.ne]: defaultStatus.DELETED } };

  if (role === usersRoles.EMPLOYEE) {
    where = { ...where, userId: user.id };
  } else if (role === usersRoles.MANAGER) {
    const managedEmployees = await User.findAll({
      where: {
        parentId: user.id,
        role: usersRoles.EMPLOYEE,
        status: { [Op.ne]: defaultStatus.DELETED },
      },
      attributes: ['id'],
    });
    where = {
      ...where,
      [Op.or]: [{ userId: user.id }, { userId: managedEmployees.map((item) => item.id) }],
    };
  }

  const rows = await Expense.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Expenses'),
    data: rows,
  };
};

const getExpenseById = async (id) => {
  const expense = await Expense.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
    include: [
      {
        model: ExpenseApproval,
        as: 'approvalHistory',
        required: false,
        include: [
          {
            model: User,
            as: 'approver',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false,
          },
        ],
      },
    ],
  });
  if (!expense) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Expense') };
  }
  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Expense'),
    data: expense,
  };
};

const createExpense = async (payload, userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'companyId', 'currencyCode'],
  });

  const data = await Expense.create({
    ...payload,
    userId,
    companyId: user?.companyId || null,
    currency: payload.currency || user?.currencyCode || 'USD',
    status: defaultStatus.PENDING,
    approvalStep: 1,
  });

  return {
    success: true,
    message: successMessage.CREATED_MESSAGE('Expense'),
    data,
  };
};

const approveExpense = async (id, currentUser) => {
  const expense = await Expense.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
  });
  if (!expense) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Expense') };
  }
  if (expense.status !== defaultStatus.PENDING) {
    return { success: false, message: 'Expense is already finalized' };
  }

  const rules = await getRulesForExpense(expense);
  const currentRule = getCurrentRule(rules, expense.approvalStep);
  const allowCfoShortcut = rules.some((rule) => rule.allowCfoShortcut);
  const currentRole = normalizeRole(currentUser.role);

  if (currentRole === 'CFO' && allowCfoShortcut) {
    expense.status = 'approved';
    expense.approvedByRole = currentUser.role;
    await expense.save();
    await ExpenseApproval.create({
      expenseId: expense.id,
      ruleId: null,
      approverId: currentUser.id,
      status: 'approved',
      comments: 'Auto-approved by CFO shortcut rule',
    });
    return {
      success: true,
      message: successMessage.CHANGED_SUCCESS_MESSAGE('Expense status'),
      data: expense,
    };
  }

  const approvalAccess = await canUserApproveRule(expense, currentRule, currentUser);
  if (!approvalAccess.allowed) {
    return { success: false, message: approvalAccess.reason };
  }

  await ExpenseApproval.create({
    expenseId: expense.id,
    ruleId: currentRule?.id || null,
    approverId: currentUser.id,
    status: 'approved',
    comments: null,
  });

  const approvedCount = await ExpenseApproval.count({
    where: { expenseId: expense.id, status: 'approved' },
  });

  const percentageRule = rules.find(
    (rule) => typeof rule.percentageThreshold === 'number' && rule.percentageThreshold > 0
  );
  const totalRequiredApprovers = rules.length || fallbackApprovalChain.length;
  const approvedPercentage = totalRequiredApprovers
    ? (approvedCount / totalRequiredApprovers) * 100
    : 0;
  const lastStepNumber =
    rules.length > 0
      ? Math.max(...rules.map((rule) => Number(rule.stepNumber) || 0))
      : fallbackApprovalChain.length;

  if (
    (percentageRule &&
      approvedPercentage >= Number(percentageRule.percentageThreshold)) ||
    Number(expense.approvalStep) >= Number(lastStepNumber)
  ) {
    expense.status = 'approved';
  } else {
    expense.approvalStep = Number(expense.approvalStep) + 1;
  }
  expense.approvedByRole = currentUser.role;
  await expense.save();

  return {
    success: true,
    message: successMessage.CHANGED_SUCCESS_MESSAGE('Expense status'),
    data: expense,
  };
};

const rejectExpense = async (id, reason, currentUser, comments = null) => {
  const expense = await Expense.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
  });
  if (!expense) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Expense') };
  }
  if (expense.status !== defaultStatus.PENDING) {
    return { success: false, message: 'Expense is already finalized' };
  }

  const rules = await getRulesForExpense(expense);
  const currentRule = getCurrentRule(rules, expense.approvalStep);
  const rejectionAccess = await canUserApproveRule(expense, currentRule, currentUser);
  if (!rejectionAccess.allowed) {
    return { success: false, message: rejectionAccess.reason };
  }

  expense.status = 'rejected';
  expense.rejectedReason = reason || null;
  expense.approvedByRole = currentUser.role;
  await expense.save();
  await ExpenseApproval.create({
    expenseId: expense.id,
    ruleId: currentRule?.id || null,
    approverId: currentUser.id,
    status: 'rejected',
    comments: comments || reason || null,
  });

  return {
    success: true,
    message: successMessage.CHANGED_SUCCESS_MESSAGE('Expense status'),
    data: expense,
  };
};

const getPendingApprovals = async (currentUser) => {
  const candidates = await Expense.findAll({
    where: {
      status: defaultStatus.PENDING,
    },
    order: [['createdAt', 'DESC']],
  });

  const checks = await Promise.all(
    candidates.map(async (expense) => {
      const rules = await getRulesForExpense(expense);
      const currentRule = getCurrentRule(rules, expense.approvalStep);
      const approvalAccess = await canUserApproveRule(expense, currentRule, currentUser);
      return approvalAccess.allowed ? expense : null;
    })
  );

  const rows = checks.filter(Boolean);

  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Pending approvals'),
    data: rows,
  };
};

const getExpenseApprovalChain = async (expenseId) => {
  const expense = await Expense.findOne({
    where: { id: expenseId, status: { [Op.ne]: defaultStatus.DELETED } },
    include: [
      {
        model: ExpenseApproval,
        as: 'approvalHistory',
        required: false,
        include: [
          {
            model: User,
            as: 'approver',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false,
          },
        ],
      },
    ],
  });
  if (!expense) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Expense') };
  }

  const rules = await getRulesForExpense(expense);

  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Approval chain'),
    data: {
      expense,
      rules,
    },
  };
};

const getTeamExpensesByManager = async (currentUser) => {
  const currentRole = normalizeRole(currentUser.role);
  if ([usersRoles.ADMIN, usersRoles.SUPER_ADMIN].includes(currentRole)) {
    const adminRows = await Expense.findAll({
      where: {
        status: { [Op.ne]: defaultStatus.DELETED },
        ...(currentUser.companyId ? { companyId: currentUser.companyId } : {}),
      },
      order: [['createdAt', 'DESC']],
    });
    return {
      success: true,
      message: successMessage.DETAIL_MESSAGE('Team expenses'),
      data: adminRows,
    };
  }

  const managedEmployees = await User.findAll({
    where: {
      parentId: currentUser.id,
      role: usersRoles.EMPLOYEE,
      status: { [Op.ne]: defaultStatus.DELETED },
    },
    attributes: ['id'],
  });
  const employeeIds = managedEmployees.map((item) => item.id);

  if (!employeeIds.length) {
    return {
      success: true,
      message: successMessage.DETAIL_MESSAGE('Team expenses'),
      data: [],
    };
  }

  const rows = await Expense.findAll({
    where: {
      userId: employeeIds,
      status: { [Op.ne]: defaultStatus.DELETED },
    },
    order: [['createdAt', 'DESC']],
  });

  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Team expenses'),
    data: rows,
  };
};

const convertExpenseAmount = async (id, toCurrency) => {
  const expense = await Expense.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
    include: [{ model: User, as: 'user', attributes: ['currencyCode'], required: false }],
  });
  if (!expense) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Expense') };
  }

  const targetCurrency =
    toCurrency || expense?.user?.currencyCode || 'USD';
  const conversion = await convertCurrency(expense.currency, targetCurrency, expense.amount);
  if (!conversion.success) return conversion;

  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Converted expense amount'),
    data: conversion.data,
  };
};

module.exports = {
  getExpensesByUser,
  getExpenseById,
  getExpenseApprovalChain,
  createExpense,
  approveExpense,
  rejectExpense,
  getPendingApprovals,
  getTeamExpensesByManager,
  convertExpenseAmount,
};
