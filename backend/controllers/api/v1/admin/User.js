const {
  checkAndLoginWithPasswordWithRole,
  checkOtpAndUpdatePassword,
  getUser,
  sendPasswordResetOtp,
  checkAndUpdateUser,
} = require('../../../../models/repositories/UserRepository');
const {
  resCode,
  genRes,
  errorTypes,
  errorMessage,
  usersRoles,
} = require('../../../../config/options');

const loginAdmin = async (req, res) => {
  try {
    const { success, message, data } = await checkAndLoginWithPasswordWithRole(
      req.body,
      usersRoles.getAdminArray()
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
    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message,
        data,
      })
    );
  } catch (error) {
    console.error(error);
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

const getUserProfile = async (req, res) => {
  try {
    let { success, data, message } = await getUser(req.user.id);
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res
      .status(resCode.HTTP_OK)
      .json(genRes(resCode.HTTP_OK, { data, message }));
  } catch (error) {
    console.log(error);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

const sendOtpToResetPassword = async (req, res) => {
  try {
    req.body.type = 'email';
    const { success, message } = await sendPasswordResetOtp(req.body);
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message,
      })
    );
  } catch (error) {
    console.error(error);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

const patchUpdatePasswordWithOtp = async (req, res) => {
  try {
    const { success, message } = await checkOtpAndUpdatePassword(req.body);
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          genRes(resCode.HTTP_BAD_REQUEST, message, errorTypes.INPUT_VALIDATION)
        );
    }
    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message,
      })
    );
  } catch (error) {
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};
const putUserUpdate = async (req, res) => {
  try {
    const query = {
      where: {
        id: req.user.id,
        role: usersRoles.getAdminArray(),
      },
    };
    const { success, message, data } = await checkAndUpdateUser(
      query,
      req.body
    );
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, { message }));
    }
    return res
      .status(resCode.HTTP_OK)
      .json(genRes(resCode.HTTP_OK, { message, data }));
  } catch (e) {
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
  loginAdmin,
  getUserProfile,
  sendOtpToResetPassword,
  patchUpdatePasswordWithOtp,
  putUserUpdate,
};
