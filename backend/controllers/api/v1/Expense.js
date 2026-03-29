const ExpenseRepository = require('../../../models/repositories/ExpenseRepository');
const { resCode, genRes, errorTypes, errorMessage } = require('../../../config/options');
const { extractExpenseDataFromReceipt } = require('../../../models/helpers/OCRHelper');
const { generateLocalFileUrl } = require('../../../models/helpers/MulterHelper');

const getExpenses = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.getExpensesByUser(req.user);
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

const getExpense = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.getExpenseById(req.params.id);
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

const getPendingApprovals = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.getPendingApprovals(req.user);
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

const getTeamExpenses = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.getTeamExpensesByManager(req.user);
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

const postExpense = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.createExpense(req.body, req.user.id);
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

const postApproveExpense = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.approveExpense(req.params.id, req.user);
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

const postRejectExpense = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.rejectExpense(
      req.params.id,
      req.body.reason,
      req.user,
      req.body.comments
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

const getApprovalChain = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.getExpenseApprovalChain(req.params.id);
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

const convertExpenseCurrency = async (req, res) => {
  try {
    const { success, message, data } = await ExpenseRepository.convertExpenseAmount(
      req.params.id,
      req.query.toCurrency
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

const uploadExpenseReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, 'Receipt file is required'));
    }

    const expenseResult = await ExpenseRepository.getExpenseById(req.params.id);
    if (!expenseResult.success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, expenseResult.message));
    }

    const localUrl = generateLocalFileUrl(req.file.filename);
    const ocrResult = await extractExpenseDataFromReceipt(req.file.path);

    const expense = expenseResult.data;
    expense.receiptUrl = localUrl;
    expense.ocrExtractedData = ocrResult.success ? ocrResult.data : null;
    await expense.save();

    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message: 'Receipt uploaded successfully',
        data: {
          expenseId: expense.id,
          receiptUrl: localUrl,
          ocrExtractedData: ocrResult.success ? ocrResult.data : null,
        },
      })
    );
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
  getExpenses,
  getExpense,
  getPendingApprovals,
  getTeamExpenses,
  postExpense,
  postApproveExpense,
  postRejectExpense,
  getApprovalChain,
  convertExpenseCurrency,
  uploadExpenseReceipt,
};
