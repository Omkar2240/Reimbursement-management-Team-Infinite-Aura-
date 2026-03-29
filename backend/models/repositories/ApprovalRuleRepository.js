const { ApprovalRule } = require('..');
const { Op } = require('sequelize');
const {
  defaultStatus,
  successMessage,
  errorMessage,
} = require('../../config/options');

const getRulesByCompany = async (companyId) => {
  const rows = await ApprovalRule.findAll({
    where: {
      companyId,
      status: { [Op.ne]: defaultStatus.DELETED },
      isActive: true,
    },
    order: [['stepNumber', 'ASC']],
  });
  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Approval rules'),
    data: rows,
  };
};

const createRule = async (payload) => {
  const data = await ApprovalRule.create(payload);
  return {
    success: true,
    message: successMessage.CREATED_MESSAGE('Approval rule'),
    data,
  };
};

const updateRule = async (id, payload) => {
  const rule = await ApprovalRule.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
  });
  if (!rule) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Approval rule') };
  }
  await rule.update(payload);
  return {
    success: true,
    message: successMessage.UPDATE_SUCCESS_MESSAGE('Approval rule'),
    data: rule,
  };
};

const deleteRule = async (id) => {
  const rule = await ApprovalRule.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
  });
  if (!rule) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Approval rule') };
  }
  rule.status = defaultStatus.DELETED;
  await rule.save();
  return {
    success: true,
    message: successMessage.DELETE_SUCCESS_MESSAGE('Approval rule'),
  };
};

module.exports = {
  getRulesByCompany,
  createRule,
  updateRule,
  deleteRule,
};
