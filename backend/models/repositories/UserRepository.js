const sequelize = require('sequelize');
const { User, AccessManagement, Company } = require('..');
const {
  defaultStatus,
  errorMessage,
  successMessage,
  emailTypes,
  otpExpireInMins,
  usersRoles,
} = require('../../config/options');
const {
  modifyOutputData,
  userAttributes,
  generateUniqueUsername,
} = require('../helpers/UserHelper');
const { genOtp, parseMobileNumber } = require('../helpers/UtilHelper');
const {
  sendResetPasswordOTPEmail,
  sendVerificationOTPEmail,
} = require('./EmailRepository');
const AuthHelper = require('../helpers/AuthHelper');
const chalk = require('chalk');
const { Op } = sequelize;

const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : email;
const emailWhere = (normalizedEmail) =>
  sequelize.where(
    sequelize.fn('lower', sequelize.fn('trim', sequelize.col('email'))),
    normalizedEmail
  );

const findByCondition = async (conditions, options) =>
  await User.findOne({ where: conditions, ...options });

const getUsersAndCount = async ({
  start = 0,
  limit = 10,
  search = '',
  status,
  fromDate,
  toDate,
  role,
}) => {
  try {
    const where = {
      status: {
        [Op.in]: Array.isArray(status)
          ? status
          : status
            ? status.split(',')
            : [defaultStatus.ACTIVE],
      },
      role,
    };

    if (search && !['all', 'null', 'undefined'].includes(search)) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (fromDate || toDate) {
      where.creationDate = {};
      if (fromDate) where.creationDate[Op.gte] = fromDate;
      if (toDate) where.creationDate[Op.lte] = toDate;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      offset: Number(start),
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'profilePicture',
        'countryCode',
        'mobileNumber',
        'status',
        'createdAt',
        'lastSignInAt',
        [sequelize.literal(`CONCAT("firstName", ' ', "lastName")`), 'fullName'],
      ],
    });

    return {
      message: successMessage.DETAIL_MESSAGE('Users'),
      data: {
        rows,
        pagination: {
          totalCount: count,
          start: Number(start),
          limit: Number(limit),
        },
      },
    };
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const getUser = async (id) => {
  try {
    const existingUser = await User.findOne({
      where: { id, status: { [Op.not]: defaultStatus.DELETED } },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'mobileNumber',
        'profilePicture',
        'status',
        'role',
        'companyId',
        'country',
        'currencyCode',
        'createdAt',
        'lastSignInAt',
      ],
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'category',
            'canView',
            'canAdd',
            'canEdit',
            'canDelete',
          ],
          required: false,
        },
      ],
    });

    if (!existingUser) {
      return {
        success: false,
        message: errorMessage.NO_USER('email address'),
      };
    } else if (existingUser.status === defaultStatus.BLOCKED) {
      return {
        success: false,
        message: errorMessage.USER_ACCOUNT_BLOCKED,
      };
    } else {
      existingUser.lastSignInAt = new Date();
      await existingUser.save();

      const data = {
        ...modifyOutputData(existingUser),
        token: existingUser.genToken(),
        companyId: existingUser.companyId || null,
      };
      return {
        success: true,
        message: successMessage.LOG('logged in'),
        data,
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const checkAndLoginWithPasswordWithRole = async (
  body,
  role,
  userAgent = null,
  ipAddress = null
) => {
  try {
    const normalizedEmail = normalizeEmail(body.email);
    const existingUser = await User.findOne({
      where: {
        [Op.and]: [emailWhere(normalizedEmail)],
        role,
        status: { [Op.ne]: defaultStatus.DELETED },
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'profilePicture',
        'status',
        'createdAt',
        'lastSignInAt',
        'role',
        'password',
        'isEmailVerified',
      ],
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'category',
            'canView',
            'canAdd',
            'canEdit',
            'canDelete',
          ],
          required: false,
        },
      ],
    });

    if (!existingUser) {
      return {
        success: false,
        message: errorMessage.NO_USER('email address'),
      };
    } else if (!existingUser.validPassword(body.password)) {
      return {
        success: false,
        message: errorMessage.INVALID_CREDENTIALS,
      };
    } else if (existingUser.status === defaultStatus.BLOCKED) {
      return {
        success: false,
        message: errorMessage.USER_ACCOUNT_BLOCKED,
      };
    }

    // If email not verified, send OTP and return a flag
    if ([usersRoles.EMPLOYEE].includes(existingUser.role)) {
      if (!existingUser.isEmailVerified) {
        const otp = genOtp();
        existingUser.tempOtp = otp;
        existingUser.tempOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await existingUser.save();
        sendVerificationOTPEmail(existingUser);

        const message = successMessage.OTP_SEND('email');
        return {
          success: true,
          message,
          data: {
            email: existingUser.email,
            isEmailVerified: false,
          },
        };
      }
    }

    existingUser.lastSignInAt = new Date();
    await existingUser.save();

    const baseData = {
      ...modifyOutputData(existingUser),
      token: existingUser.genToken(),
    };

    // Handle device session management if device info is provided
    if (userAgent && ipAddress) {
      const deviceSessionResult =
        await AuthHelper.handleDeviceSessionManagement(
          baseData,
          userAgent,
          ipAddress
        );

      if (!deviceSessionResult.success) {
        return {
          success: false,
          message: deviceSessionResult.message,
        };
      }

      // Use the updated token with sessionId from device session management
      return {
        success: true,
        message: successMessage.LOG('logged in'),
        data: deviceSessionResult.data, // This contains the updated token with sessionId
      };
    }

    return {
      success: true,
      message: successMessage.LOG('logged in'),
      data: baseData,
    };
  } catch (error) {
    throw new Error(`Error Admin logging in: ${error.message}`);
  }
};

const checkAndSignupWithRole = async (
  body,
  allowedRoles = [],
  userAgent = null,
  ipAddress = null
) => {
  try {
    const normalizedEmail = normalizeEmail(body.email);
    body.email = normalizedEmail;
    const query = {
      status: { [Op.ne]: defaultStatus.DELETED },
      [Op.or]: [
        body.email && emailWhere(normalizedEmail),
        body.mobileNumber && {
          mobileNumber: body.mobileNumber,
          countryCode: body.countryCode,
        },
        body.googleId && {
          googleId: body.googleId,
        },
      ].filter(Boolean),
    };

    if (body.role) {
      if (allowedRoles.length && !allowedRoles.includes(body.role)) {
        return {
          success: false,
          message: errorMessage.INVALID_ROLE_SELECTION,
        };
      }
    } else if (allowedRoles.length) {
      body.role = allowedRoles[0];
    }

    const existingUser = await User.findOne({
      where: query,
      attributes: userAttributes(),
    });
    if (!existingUser) {
      const data = await createUser({
        ...body,
        tempOtp: body.googleId ? null : genOtp(),
        tempOtpExpiresAt: body.googleId
          ? null
          : new Date(Date.now() + 15 * 60 * 1000),
        isEmailVerified: body.googleId ? true : false,
      });

      // For Admin signups, auto-create a company and attach it to the admin.
      if (data.role === usersRoles.ADMIN && !data.companyId) {
        const companyName = `${data.firstName || 'Admin'} Company ${data.id}`;
        const company = await Company.create({
          name: companyName,
          country: body.country || null,
          currencyCode:
            body.currencyCode || process.env.DEFAULT_CURRENCY_CODE || 'USD',
          adminUserId: data.id,
        });
        data.companyId = company.id;
        await data.save();
      }

      if (body.email && !body.googleId) {
        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          tempOtp: data.tempOtp,
        };
        sendVerificationOTPEmail(payload);
      }

      const message = body.googleId
        ? successMessage.LOG('logged in')
        : successMessage.OTP_SEND('email');

      const baseData = {
        ...modifyOutputData(data),
        token: data.genToken(),
        isNew: true,
      };

      // Handle device session management for Google SSO new users
      if (body.googleId && userAgent && ipAddress) {
        // Update last sign-in time for new Google SSO users
        data.lastSignInAt = new Date();
        await data.save();

        const deviceSessionResult =
          await AuthHelper.handleDeviceSessionManagement(
            baseData,
            userAgent,
            ipAddress
          );

        if (!deviceSessionResult.success) {
          return {
            success: false,
            message: deviceSessionResult.message,
          };
        }

        // Use the updated token with sessionId from device session management
        baseData.token = deviceSessionResult.data.token;
        baseData.deviceSession = deviceSessionResult.data.deviceSession;
      }

      // Assign free plan to Google SSO users
      if (body.googleId) {
        try {
          await SubscriptionRepository.assignFreePlanToUser(data.id);
        } catch (error) {
          console.error(`Error assigning free plan to Google SSO user`, error);
          // Don't fail the signup process if free plan assignment fails
        }
      }

      return {
        success: true,
        message,
        data: baseData,
      };
    }

    if (existingUser.status === defaultStatus.BLOCKED) {
      return {
        success: false,
        message: errorMessage.USER_ACCOUNT_BLOCKED,
      };
    }
    if (existingUser && existingUser.googleId) {
      // Update last sign-in time
      existingUser.lastSignInAt = new Date();
      await existingUser.save();

      const baseData = {
        ...modifyOutputData(existingUser),
        token: existingUser.genToken(),
        isNew: false,
      };

      // Handle device session management if device info is provided
      if (userAgent && ipAddress) {
        const deviceSessionResult =
          await AuthHelper.handleDeviceSessionManagement(
            baseData,
            userAgent,
            ipAddress
          );

        if (!deviceSessionResult.success) {
          return {
            success: false,
            message: deviceSessionResult.message,
          };
        }

        // Use the updated token with sessionId from device session management
        baseData.token = deviceSessionResult.data.token;
        baseData.deviceSession = deviceSessionResult.data.deviceSession;
      }

      return {
        success: true,
        message: successMessage.LOG('logged in'),
        data: baseData,
      };
    }
    return {
      success: false,
      message: errorMessage.EXISTS_USER('email or phone number'),
    };
  } catch (error) {
    console.error('Error in checkAndSignupWithRole:', error);
    return {
      success: false,
      message: errorMessage.SERVER_ERROR,
    };
  }
};

const checkDuplicate = async (body, existingUser) => {
  try {
    const conditions = [];
    const normalizedEmail = normalizeEmail(body.email);

    if (normalizedEmail) {
      conditions.push(emailWhere(normalizedEmail));
    }
    if (body.mobileNumber) {
      conditions.push({
        mobileNumber: body.mobileNumber,
        countryCode: body.countryCode,
      });
    }

    if (conditions.length === 0) {
      return null;
    }
    return await User.findOne({
      where: {
        [Op.or]: conditions,
        id: { [Op.ne]: existingUser.id },
        status: { [Op.ne]: defaultStatus.DELETED },
      },
      attributes: ['id', 'email', 'mobileNumber', 'countryCode'],
    });
  } catch (error) {
    throw new Error(`Error checking duplicate user: ${error.message}`);
  }
};

const createUser = async (data) => {
  try {
    const username = await generateUniqueUsername();
    const normalizedEmail = normalizeEmail(data.email);
    const payload = {
      userName: username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob || null,
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      role: data.role,
      profilePicture: data.profilePicture || null,
      email: normalizedEmail,
      companyId: data.companyId || null,
      country: data.country || null,
      currencyCode: data.currencyCode || null,
      tempOtp: data.tempOtp,
      tempOtpExpiresAt: data.tempOtpExpiresAt,
      googleId: data.googleId || null,
      isEmailVerified: data.isEmailVerified || false,
    };

    const createdUser = await User.create(payload);
    if (usersRoles.getNonAdminArray().includes(data.role)) {
      // getUserPointsWalletById(createdUser.id).then(); // TODO: Implement wallet points system
    }
    return createdUser;
  } catch (error) {
    console.error(chalk.red('x'), 'Error creating user', error);
    throw new Error(error);
  }
};

const checkAndCreate = async (body) => {
  const normalizedEmail = normalizeEmail(body.email);
  body.email = normalizedEmail;
  const mobileCondition = body.mobileNumber
    ? body.countryCode
      ? {
          mobileNumber: body.mobileNumber,
          countryCode: body.countryCode,
        }
      : { mobileNumber: body.mobileNumber }
    : null;
  const query = {
    status: { [Op.ne]: defaultStatus.DELETED },
    [Op.or]: [
      body.email && emailWhere(normalizedEmail),
      mobileCondition,
    ].filter(Boolean),
  };

  const existingUser = await User.findOne({
    where: query,
    attributes: [
      'id',
      'countryCode',
      'mobileNumber',
      'email',
      'status',
      'role',
      'companyId',
    ],
  });

  if (!existingUser) {
    const data = await createUser(body);
    const message = successMessage.ADD_SUCCESS_MESSAGE('User');
    return {
      success: true,
      message,
      data,
    };
  }
  if (existingUser.status === defaultStatus.BLOCKED) {
    return {
      success: false,
      message: errorMessage.USER_ACCOUNT_BLOCKED,
    };
  }
  return {
    success: false,
    message: errorMessage.EXISTS_USER('email or phone number'),
  };
};

const checkAndUpdateUser = async (query, data) => {
  try {
    const existingUser = await User.findOne(query);
    if (!existingUser) {
      return { success: false, message: errorMessage.DOES_NOT_EXIST('User') };
    }
    existingUser.firstName = data.firstName || existingUser.firstName;
    existingUser.lastName = data.lastName || existingUser.lastName;
    existingUser.email = normalizeEmail(data.email) || existingUser.email;
    existingUser.mobileNumber = data.mobileNumber || existingUser.mobileNumber;
    existingUser.countryCode = data.countryCode || existingUser.countryCode;
    existingUser.country = data.country || existingUser.country;
    existingUser.currencyCode = data.currencyCode || existingUser.currencyCode;
    existingUser.profilePicture = data.profilePicture;
    existingUser.password = data.password || existingUser.password;

    await existingUser.save();
    return {
      success: true,
      data: existingUser,
      message: successMessage.UPDATE_SUCCESS_MESSAGE('User'),
    };
  } catch (e) {
    throw new Error(e);
  }
};

const checkAndUpdateStatus = async (id, isDelete) => {
  try {
    const query = {
      id,
      status: { [Op.ne]: defaultStatus.DELETED },
    };

    const existingUser = await User.findOne({
      where: query,
      attributes: ['id', 'email', 'mobileNumber', 'countryCode', 'status'],
    });

    if (!existingUser) {
      return { success: false, message: errorMessage.DOES_NOT_EXIST('User') };
    }

    existingUser.status =
      existingUser.status === defaultStatus.ACTIVE
        ? defaultStatus.BLOCKED
        : defaultStatus.ACTIVE;

    if (isDelete) {
      existingUser.status = defaultStatus.DELETED;
      existingUser.mobileNumber = `${existingUser.mobileNumber}${Date.now()}${defaultStatus.DELETED}`;
      existingUser.email = `${existingUser.email}${Date.now()}${defaultStatus.DELETED}`;
    }

    await existingUser.save();

    return {
      success: true,
      message: successMessage.CHANGED_SUCCESS_MESSAGE('User status'),
    };
  } catch (error) {
    throw new Error(error);
  }
};

const generateAndSendOtp = async (
  existingUser,
  isEmail = false,
  emailType = null
) => {
  const todayDate = new Date();
  let tempOtp = genOtp();
  todayDate.setMinutes(todayDate.getMinutes() + otpExpireInMins);
  existingUser.tempOtp = tempOtp;
  existingUser.tempOtpExpiresAt = todayDate;
  await existingUser.save();
  if (!isEmail) {
    // send to mobile
  } else {
    const payload = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      tempOtp,
    };
    if (emailTypes.EMAIL_RESET_PASSWORD_OTP === emailType) {
      sendResetPasswordOTPEmail(payload);
    } else {
      sendVerificationOTPEmail(payload);
    }
  }
  return true;
};

const sendPasswordResetOtp = async (data) => {
  try {
    const normalizedEmail = normalizeEmail(data.email);
    const query = {
      [Op.and]: [emailWhere(normalizedEmail)],
      status: { [Op.ne]: defaultStatus.DELETED },
    };
    const existingUser = await User.findOne({
      where: query,
      attributes: [
        'id',
        'email',
        'mobileNumber',
        'status',
        'tempOtp',
        'tempOtpExpiresAt',
      ],
    });

    if (!existingUser) {
      return {
        success: false,
        message: errorMessage.DOES_NOT_EXIST('User'),
      };
    }
    if (existingUser && existingUser.status === defaultStatus.BLOCKED) {
      return {
        success: false,
        message: errorMessage.USER_ACCOUNT_BLOCKED,
      };
    }

    await generateAndSendOtp(
      existingUser,
      data.type === 'email',
      emailTypes.EMAIL_RESET_PASSWORD_OTP
    );

    return {
      success: true,
      message: successMessage.OTP_SEND(
        data.type === 'email' ? 'email address' : 'registered mobile number'
      ),
    };
  } catch (e) {
    throw new Error(e);
  }
};

const checkOtpAndUpdatePassword = async (body) => {
  try {
    const normalizedEmail = normalizeEmail(body.email);
    const query = {
      [Op.and]: [emailWhere(normalizedEmail)],
      status: { [Op.ne]: defaultStatus.DELETED },
      tempOtp: body.tempOtp,
      tempOtpExpiresAt: { [Op.gte]: new Date() },
    };

    const existingUser = await User.findOne({
      where: query,
    });

    if (!existingUser) {
      return {
        success: false,
        message: errorMessage.OTP_INVALID,
        data: null,
      };
    }

    existingUser.password = body.password;
    await existingUser.save();

    return {
      success: true,
      message: successMessage.UPDATE_SUCCESS_MESSAGE('Password'),
    };
  } catch (e) {
    throw new Error(e);
  }
};

const checkUserAndLoginWithOtp = async (body) => {
  try {
    const normalizedEmail = normalizeEmail(body.email);
    const query = {
      [Op.and]: [emailWhere(normalizedEmail)],
      status: { [Op.ne]: defaultStatus.DELETED },
    };

    const existingUser = await User.findOne({
      where: query,
      attributes: [
        'id',
        'email',
        'mobileNumber',
        'status',
        'firstName',
        'lastName',
        'tempOtp',
        'tempOtpExpiresAt',
      ],
    });

    if (!existingUser) {
      return {
        success: false,
        message: errorMessage.NO_USER('email address'),
      };
    }

    if (existingUser.status === defaultStatus.BLOCKED) {
      return {
        success: false,
        message: errorMessage.USER_ACCOUNT_BLOCKED,
      };
    }

    await generateAndSendOtp(
      existingUser,
      true,
      emailTypes.EMAIL_OTP_VERIFICATION
    );

    return {
      success: true,
      message: successMessage.OTP_SEND('email address'),
    };
  } catch (error) {
    console.error('Error in checkUserAndLoginWithOtp:', error);
    return {
      success: false,
      message: errorMessage.SERVER_ERROR,
    };
  }
};

const checkAndVerifyOtp = async (data) => {
  try {
    const { otp } = data;
    const email = normalizeEmail(data.email);

    const user = await User.findOne({
      where: {
        [Op.and]: [emailWhere(email)],
        status: { [Op.ne]: defaultStatus.DELETED },
        tempOtp: otp,
        tempOtpExpiresAt: { [Op.gte]: new Date() },
      },
      attributes: userAttributes(),
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired OTP',
      };
    }

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }

    user.tempOtp = null;
    user.tempOtpExpiresAt = null;
    await user.save();

    // Assign free plan to user after email verification
    try {
      // SubscriptionRepository.assignFreePlanToUser(user.id);
    } catch (error) {
      console.error(`Error assigning free plan to user`, error);
      // Don't fail the verification process if free plan assignment fails
    }

    const userData = {
      ...modifyOutputData(user),
      token: user.genToken(),
    };

    return {
      success: true,
      message: 'OTP verified successfully',
      data: userData,
    };
  } catch (error) {
    console.error('Error in checkAndVerifyOtp:', error);
    return {
      success: false,
      message: errorMessage.SERVER_ERROR,
    };
  }
};

const bulkCreate = async (users = [], companyId) => {
  try {
    console.log(chalk.yellow('#'), 'Bulk data of length: ', users.length);
    for (const user of users) {
      const payload = {
        firstName: user['First Name'],
        lastName: user['Last Name'],
        email: user.Email,
        mobileNumber: String(user.Mobile),
        countryCode: user.CountryCode || '91',
        role: usersRoles.EMPLOYEE,
        password: user.Password,
        companyId: companyId,
      };
      const parseNumberData = parseMobileNumber(`+${user.Mobile.toString()}`);
      if (
        parseNumberData &&
        parseNumberData.possible &&
        parseNumberData.valid
      ) {
        payload.mobileNumber = parseNumberData.number.significant;
        payload.countryCode = parseNumberData.countryCode.toString();
      }
      console.log(chalk.yellow('#'), 'payload', payload);
      const query = {
        where: {
          status: { [Op.notIn]: [defaultStatus.DELETED] },
          [Op.or]: [
            payload.email && {
              email: String(payload.email),
            },
            payload.mobileNumber && {
              [Op.and]: {
                mobileNumber: String(payload.mobileNumber),
                countryCode: String(payload.countryCode),
              },
            },
          ],
        },
        attributes: [
          'id',
          'firstName',
          'lastName',
          'countryCode',
          'mobileNumber',
          'email',
          'profilePicture',
          'status',
          'lastSignInAt',
        ],
      };
      const existingUser = await User.findOne(query);
      if (!existingUser) {
        const newUser = await createUser(payload);
        console.log(
          chalk.green('✓'),
          successMessage.ADD_SUCCESS_MESSAGE('User'),
          ':',
          JSON.stringify(newUser)
        );
      } else {
        console.log(
          chalk.red('X'),
          errorMessage.EXISTS_USER('email'),
          ':',
          JSON.stringify(payload)
        );
        existingUser.lastName = payload.lastName;
        existingUser.firstName = payload.firstName;
        if (
          parseNumberData &&
          parseNumberData.possible &&
          parseNumberData.valid
        ) {
          existingUser.mobileNumber = parseNumberData.number.significant;
          existingUser.countryCode = parseNumberData.countryCode.toString();
        }
        await existingUser.save();
        console.log(
          chalk.green('✓'),
          'Updating first name and last name',
          ':',
          JSON.stringify(existingUser)
        );
      }
    }
    return {
      success: true,
      message: 'Bulk upload completed. Existing users were skipped.',
    };
  } catch (error) {
    throw new Error(error);
  }
};

const templateForEmployeeBulkUpload = async () => {
  try {
    const columns = [
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Password', key: 'password', width: 15 },
    ];

    const sampleData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        department: 'Engineering',
        role: 'EMPLOYEE',
        password: 'password123',
      },
    ];

    return await GenerateExcelHelper.generateExcel(
      sampleData,
      columns,
      'Employee Upload Template',
      `bulk-employee-template-${Date.now()}.xlsx`
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  findByCondition,
  getUsersAndCount,
  getUser,
  checkAndLoginWithPasswordWithRole,
  checkAndSignupWithRole,
  checkDuplicate,
  createUser,
  checkAndCreate,
  checkAndUpdateUser,
  generateAndSendOtp,
  sendPasswordResetOtp,
  checkOtpAndUpdatePassword,
  checkAndUpdateStatus,
  checkUserAndLoginWithOtp,
  checkAndVerifyOtp,
  bulkCreate,
  templateForEmployeeBulkUpload,
};
