const { Company } = require('..');
const { Op } = require('sequelize');
const {
  defaultStatus,
  successMessage,
  errorMessage,
} = require('../../config/options');

const getCompanies = async () => {
  const rows = await Company.findAll({
    where: { status: { [Op.ne]: defaultStatus.DELETED } },
    order: [['createdAt', 'DESC']],
  });
  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Companies'),
    data: rows,
  };
};

const createCompany = async (payload) => {
  const existing = await Company.findOne({
    where: {
      name: payload.name,
      status: { [Op.ne]: defaultStatus.DELETED },
    },
  });
  if (existing) {
    return { success: false, message: errorMessage.ALREADY_EXIST('Company') };
  }

  const data = await Company.create(payload);
  return {
    success: true,
    message: successMessage.CREATED_MESSAGE('Company'),
    data,
  };
};

const getCompanyById = async (id) => {
  const data = await Company.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
  });
  if (!data) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Company') };
  }
  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Company'),
    data,
  };
};

const updateCompany = async (id, payload) => {
  const company = await Company.findOne({
    where: { id, status: { [Op.ne]: defaultStatus.DELETED } },
  });
  if (!company) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Company') };
  }
  await company.update(payload);
  return {
    success: true,
    message: successMessage.UPDATE_SUCCESS_MESSAGE('Company'),
    data: company,
  };
};

module.exports = {
  getCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
};
