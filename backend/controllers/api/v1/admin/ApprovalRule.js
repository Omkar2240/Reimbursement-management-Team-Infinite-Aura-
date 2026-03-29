const ApprovalRuleRepository = require('../../../../models/repositories/ApprovalRuleRepository');
const {
  resCode,
  genRes,
  errorTypes,
  errorMessage,
} = require('../../../../config/options');

const postCreateRule = async (req, res) => {
  try {
    const { success, message, data } = await ApprovalRuleRepository.createRule(req.body);
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

const getRuleListing = async (req, res) => {
  try {
    const { success, message, data } = await ApprovalRuleRepository.getRulesByCompany(
      req.params.companyId
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

const putUpdateRule = async (req, res) => {
  try {
    const { success, message, data } = await ApprovalRuleRepository.updateRule(
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

const deleteRule = async (req, res) => {
  try {
    const { success, message } = await ApprovalRuleRepository.deleteRule(req.params.id);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_OK).json(genRes(resCode.HTTP_OK, { message }));
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
  postCreateRule,
  getRuleListing,
  putUpdateRule,
  deleteRule,
};
