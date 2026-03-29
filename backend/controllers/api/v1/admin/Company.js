const CompanyRepository = require('../../../../models/repositories/CompanyRepository');
const {
  resCode,
  genRes,
  errorTypes,
  errorMessage,
} = require('../../../../config/options');

const getCompanyListing = async (req, res) => {
  try {
    const { success, message, data } = await CompanyRepository.getCompanies();
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_OK).json(genRes(resCode.HTTP_OK, { message, data }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          errorMessage.SERVER_ERROR,
          errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const postCreateCompany = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      adminUserId: req.body.adminUserId || req.user.id,
    };
    const { success, message, data } = await CompanyRepository.createCompany(payload);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_CREATE).json(genRes(resCode.HTTP_CREATE, { message, data }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          errorMessage.SERVER_ERROR,
          errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const getCompany = async (req, res) => {
  try {
    const { success, message, data } = await CompanyRepository.getCompanyById(req.params.id);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_OK).json(genRes(resCode.HTTP_OK, { message, data }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          errorMessage.SERVER_ERROR,
          errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const putUpdateCompany = async (req, res) => {
  try {
    const { success, message, data } = await CompanyRepository.updateCompany(
      req.params.id,
      req.body
    );
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_OK).json(genRes(resCode.HTTP_OK, { message, data }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          errorMessage.SERVER_ERROR,
          errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};

module.exports = {
  getCompanyListing,
  postCreateCompany,
  getCompany,
  putUpdateCompany,
};
