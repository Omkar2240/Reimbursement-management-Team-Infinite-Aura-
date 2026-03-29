const {
  getAdminsAndCount,
  checkAndCreateAdmin,
  checkAndUpdateAdmin,
  checkAndPatchAdminStatus,
  checkAndGetAdmin,
} = require('../../../../models/repositories/SubAdminRepository');
const {
  resCode,
  genRes,
  errorTypes,
  errorMessage,
  defaultStatus,
} = require('../../../../config/options');

const postCreateAdmin = async (req, res) => {
  try {
    const { success, data, message } = await checkAndCreateAdmin(req.body);
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res
      .status(resCode.HTTP_OK)
      .json(genRes(resCode.HTTP_OK, { data, message }));
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

const getAdminListing = async (req, res) => {
  try {
    const {
      start = 0,
      limit = 10,
      status = [defaultStatus.ACTIVE, defaultStatus.BLOCKED],
      search = null,
    } = req.query;

    const { message, data } = await getAdminsAndCount({
      start,
      limit,
      status,
      search,
    });

    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message,
        data,
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

const getAdmin = async (req, res) => {
  try {
    const { success, message, data } = await checkAndGetAdmin(req.params.id);
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message,
        data,
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

const putUpdateAdmin = async (req, res) => {
  try {
    const { success, message, data } = await checkAndUpdateAdmin(
      req.body,
      req.params.id
    );
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message,
        data,
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

const patchChangeStatus = async (req, res) => {
  try {
    const { success, message } = await checkAndPatchAdminStatus(
      req.params.id,
      false
    );
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          genRes(
            resCode.HTTP_BAD_REQUEST,
            message,
            errorTypes.ACCESS_DENIED_EXCEPTION
          )
        );
    }
    return res
      .status(resCode.HTTP_CREATE)
      .json(genRes(resCode.HTTP_CREATE, { message }));
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

const deleteAdmin = async (req, res) => {
  try {
    const { success, message } = await checkAndPatchAdminStatus(
      req.params.id,
      true
    );
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          genRes(
            resCode.HTTP_BAD_REQUEST,
            message,
            errorTypes.ACCESS_DENIED_EXCEPTION
          )
        );
    }
    return res
      .status(resCode.HTTP_CREATE)
      .json(genRes(resCode.HTTP_CREATE, { message }));
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
  postCreateAdmin,
  getAdminListing,
  getAdmin,
  putUpdateAdmin,
  patchChangeStatus,
  deleteAdmin,
};
