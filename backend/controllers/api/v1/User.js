const UserRepository = require('../../../models/repositories/UserRepository');

const {
  genRes,
  errorMessage,
  resCode,
  defaultStatus,
  errorTypes,
  usersRoles,
} = require('../../../config/options');
const { checkGoogleToken } = require('../../../models/helpers/SingleSSOHelper');

exports.login = async (req, res) => {
  try {
    // Extract device information
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';

    const responseUser = await UserRepository.checkAndLoginWithPasswordWithRole(
      req.body,
      usersRoles.getNonAdminArray(),
      userAgent,
      ipAddress
    );
    if (!responseUser.success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, responseUser.message));
    }
    delete responseUser.success;
    return res
      .status(resCode.HTTP_OK)
      .json(genRes(resCode.HTTP_OK, responseUser));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

exports.signup = async (req, res) => {
  try {
    const referralCode = req.body.referralCode;
    if (referralCode) {
      const user = await UserRepository.findByCondition(
        { referralCode: referralCode, status: 'active' },
        { attributes: ['id'] }
      );
      if (!user) {
        return res
          .status(resCode.HTTP_BAD_REQUEST)
          .json(
            genRes(
              resCode.HTTP_BAD_REQUEST,
              'Invalid referral code. You can correct it or continue without a code'
            )
          );
      }
    }

    const { success, message } = await UserRepository.checkAndSignupWithRole(
      req.body,
      usersRoles.getNonAdminArray()
    );
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res
      .status(resCode.HTTP_OK)
      .json(genRes(resCode.HTTP_OK, { message }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { success, message } = await UserRepository.checkUserAndLoginWithOtp(
      req.body
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
      })
    );
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { success, message, data } = await UserRepository.checkAndVerifyOtp(
      req.body
    );
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
        data,
      })
    );
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

exports.putUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const query = {
      where: {
        id,
      },
      attributes: {
        exclude: ['tempOtp', 'tempOtpExpiresAt', 'password', 'role'],
      },
    };
    const { success, message, data } = await UserRepository.checkAndUpdateUser(
      query,
      req.body
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
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { success, message, data } = await UserRepository.getUser(
      req.user.id
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
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

exports.sendOtpToResetPassword = async (req, res) => {
  try {
    req.body.type = 'email';
    const { success, message } = await UserRepository.sendPasswordResetOtp(
      req.body
    );
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

exports.patchUpdatePasswordWithOtp = async (req, res) => {
  try {
    const { success, message } = await UserRepository.checkOtpAndUpdatePassword(
      req.body
    );
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

exports.deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await UserRepository.getUser({
      where: { id },
    });
    if (!user) {
      return res
        .status(resCode.HTTP_NOT_FOUND)
        .json(
          genRes(resCode.HTTP_NOT_FOUND, errorMessage.DOES_NOT_EXIST('User'))
        );
    }
    const { success, message } = await UserRepository.patchUpdateStatus(
      user,
      defaultStatus.DELETED,
      true
    );

    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }

    return res
      .status(resCode.HTTP_OK)
      .json(
        genRes(resCode.HTTP_OK, { message: 'Account deleted successfully' })
      );
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};

exports.loginWitSSO = async (req, res) => {
  try {
    // Extract device information
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';

    let payload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: usersRoles.EMPLOYEE,
    };
    switch (req.body.ssoProvider) {
      case 'google':
        const googleResp = await checkGoogleToken(req.body);
        if (!googleResp.success) {
          return res
            .status(resCode.HTTP_BAD_REQUEST)
            .json(
              genRes(
                resCode.HTTP_BAD_REQUEST,
                googleResp.message,
                errorTypes.OAUTH_EXCEPTION
              )
            );
        }
        payload = {
          ...payload,
          googleId: req.body.googleId,
          email: googleResp.data.email.toLowerCase(),
        };
        break;
      default:
        break;
    }
    if (!payload) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          genRes(
            resCode.HTTP_BAD_REQUEST,
            errorMessage.INVALID_REQUEST,
            errorTypes.OAUTH_EXCEPTION
          )
        );
    }
    const { success, data, message } =
      await UserRepository.checkAndSignupWithRole(
        payload,
        usersRoles.getNonAdminArray(),
        userAgent,
        ipAddress
      );
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, message));
    }
    return res
      .status(resCode.HTTP_OK)
      .json(genRes(resCode.HTTP_OK, { message, data }));
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
