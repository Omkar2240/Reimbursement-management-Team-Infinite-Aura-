const UtilHelper = require('../models/helpers/UtilHelper');

const options = {
  emailSenderName: 'FlowExpense',
  randomUsernameSize: 10,
  jwtTokenExpiry: '7d',
  defaultOTP: 5555,
  refreshTokenExpiryTime: 300,
  userNamePrefix: 'KM',
  otpExpireInMins: 5,
  signedUrlExpireSeconds: 3000,
  defaultCountry: 'India',
  defaultStatus: {
    ON_BOARDED: 'on_boarded',
    PENDING: 'pending',
    ACTIVE: 'active',
    BLOCKED: 'blocked',
    DELETED: 'deleted',
  },
  emailSubjects: {
    ACCOUNT_PASSWORD_RESET: 'Password Reset OTP',
    EMAIL_VERIFICATION_OTP: 'Verify Your Email Address',
  },
  emailTemplate: {
    'reset-password-otp-email': (data) => {
      return {
        title: 'Your OTP for password reset',
        tempOtp: data.tempOtp,
        mailMessage: {
          line1: `Your OTP for password reset`,
          line2: `Enter this OTP on the password reset page. OTP is `,
          line3: 'confidential, please do not share with anyone.',
        },
        logo: `${process.env.BACKEND_URL}/assets/logo.png`,
      };
    },
    'email-otp-verification': (data) => {
      return {
        title: 'Your OTP for email verification',
        tempOtp: data.tempOtp,
        mailMessage: {
          line1: `Your OTP for email verification`,
          line2: `Enter this OTP on the email verification page. OTP is `,
          line3: 'confidential, please do not share with anyone.',
        },
        logo: `${process.env.BACKEND_URL}/assets/logo.png`,
      };
    },
    'contact-us-email': (data) => {
      return {
        title: `New Contact Us Message`,
        mailMessage: {
          line1: `You have received a new message from the website contact form.`,
          line2: `Details are given below:`,
        },
        contactDetails: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        },
        logo: `${process.env.BACKEND_URL}/assets/logo.png`,
      };
    },
    'welcome-signup-email': (data) => {
      return {
        title: `Welcome to FlowExpense - Smart Reimbursement Engine!`,
        mailMessage: {
          line1: `Welcome to FlowExpense, ${data.name}!`,
          line2: `Thank you for joining our platform. We're excited to help you streamline and automate expense reimbursements.`,
          line3: `Your account has been successfully created and you can now manage expenses with full transparency.`,
          line4: `Start managing your expenses today!`,
        },
        logo: `${process.env.BACKEND_URL}/assets/logo.png`,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      };
    },
  },
  genNotificationMessage: {},
  emailTypes: {
    EMAIL_OTP_VERIFICATION: 'email_otp_verification',
    EMAIL_RESET_PASSWORD_OTP: 'email_reset_password_otp',
    EMAIL_REGISTERED_SUCCESSFULLY: 'email_registered_successfully',
    EMAIL_SKILL_VERIFICATION: 'email_skill_verification',
    EMAIL_PROFILE_APPROVED: 'email_profile_approved',
    EMAIL_ACCOUNT_BLOCKED: 'email_account_blocked',
    EMAIL_PROFILE_REJECTED: 'email_profile_rejected',
    EMAIL_MOBILE_NUMBER_CHANGED: 'email_mobile_number_changed',
    EMAIL_CHANGED: 'email_changed',
    EMAIL_RESET_PASSWORD_OTP: 'reset_password_otp_email',
  },
  resCode: {
    HTTP_OK: 200,
    HTTP_CREATE: 201,
    HTTP_NO_CONTENT: 204,
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_FORBIDDEN: 403,
    HTTP_NOT_FOUND: 404,
    HTTP_METHOD_NOT_ALLOWED: 405,
    HTTP_CONFLICT: 409,
    HTTP_INTERNAL_SERVER_ERROR: 500,
    HTTP_SERVICE_UNAVAILABLE: 503,
  },
  errorTypes: {
    OAUTH_EXCEPTION: 'OAuthException',
    ACCESS_DENIED_EXCEPTION: 'AccessDeniedException',
    ALREADY_AUTHENTICATED: 'AlreadyAuthenticated',
    UNAUTHORIZED_ACCESS: 'UnauthorizedAccess',
    FORBIDDEN: 'Forbidden',
    INPUT_VALIDATION: 'InputValidationException',
    ACCOUNT_ALREADY_EXIST: 'AccountAlreadyExistException',
    ACCOUNT_DOES_NOT_EXIST: 'AccountDoesNotExistException',
    ENTITY_NOT_FOUND: 'EntityNotFound',
    DUPLICATE_ENTITY: 'DuplicateEntity',
    ACCOUNT_BLOCKED: 'AccountBlocked',
    ACCOUNT_DEACTIVATED: 'AccountDeactivated',
    CONTENT_BLOCKED: 'ContentBlocked',
    CONTENT_REMOVED: 'ContentRemoved',
    PRIVATE_CONTENT: 'PrivateContent',
    PRIVATE_ACCOUNT: 'PrivateAccount',
    DUPLICATE_REQUEST: 'DuplicateRequest',
    EMAIL_NOT_VERIFIED: 'emailNotVerified',
    MOBILE_NUMBER_NOT_VERIFIED: 'mobileNumberNotVerified',
    INTERNAL_SERVER_ERROR: 'InternalServerError',
    CATCH_ERRORS: 'Oops! something went wrong.',
  },
  errorMessage: {
    UNAUTHORIZED_ACCESS: 'Not authorized to perform this action',
    SERVER_ERROR: 'Oops! something went wrong.',
    INVALID_CREDENTIALS: 'The email and/or password entered are incorrect',
    INVALID_ACTION: (data) => `Invalid action: ${data}`,
    OTP_INVALID: 'Invalid Otp',
    CONTACT_ADMIN: 'Contact admin to perform edit',
    COUNTRY_CODE: 'Please add country code',
    INCORRECT_DATA: (data) => `The ${data} entered is incorrect`,
    INVALID_REQUEST: 'Invalid Request',
    USER_ACCOUNT_BLOCKED: 'Your account has been blocked, Please contact admin',
    ROLE_INVALID_LOGIN: 'Account access denied',
    INVALID_ROLE_SELECTION: 'Invalid role',
    NO_USER: (data) => `User does not exists with this ${data}`,
    EXISTS_USER: (data) => `User exists with ${data}`,
    DOES_NOT_EXIST: (data) => `The ${data} does not exist`,
    ALREADY_EXIST: (data) => `The ${data} already exist`,
    INCORRECT_FILE_DATA: 'File contains invalid data',
    SAME_EMAIL_MOBILE_EXISTS: (data) => `User with same ${data} already exists`,
    DATA_NOT_FOUND: 'Data not found',
  },
  successMessage: {
    OTP_SEND: (type) => `An OTP has been send to your ${type}`,
    OTP_VERIFIED: (type) => `OTP has been verified`,
    LOG: (data) => `You have ${data} successfully`,
    UPDATE_SUCCESS_MESSAGE: (data) => `${data} updated successfully`,
    DELETE_SUCCESS_MESSAGE: (data) => `${data} deleted successfully`,
    REMOVED_SUCCESS_MESSAGE: (data) => `${data} removed successfully`,
    ADD_SUCCESS_MESSAGE: (data) => `${data} added successfully`,
    SAVED_SUCCESS_MESSAGE: (data) => `${data} saved successfully`,
    CREATED_MESSAGE: (data) => `${data} created successfully`,
    GENERATE_SUCCESS_MESSAGE: (data) => `${data} generate successfully`,
    CHANGED_SUCCESS_MESSAGE: (data) => `${data} changed successfully`,
    VERIFIED_SUCCESS_MESSAGE: (data) => `${data} verified successfully`,
    SEND_SUCCESS_MESSAGE: (data) => `${data} send successfully`,
    DETAIL_MESSAGE: (data) => `Fetched ${data} details successfully`,
  },
  usersRoles: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE',
    getAdminArray: () => [
      options.usersRoles.SUPER_ADMIN,
      options.usersRoles.ADMIN,
    ],
    getManagerArray: () => [
      options.usersRoles.MANAGER,
    ],
    getEmployeeArray: () => [
      options.usersRoles.EMPLOYEE,
    ],
    getAllRolesAsArray: () => [
      options.usersRoles.SUPER_ADMIN,
      options.usersRoles.ADMIN,
      options.usersRoles.MANAGER,
      options.usersRoles.EMPLOYEE,
    ],
    getNonAdminArray: () => [
      options.usersRoles.MANAGER,
      options.usersRoles.EMPLOYEE,
    ],
  },
  rolePermissions: {
    SUPER_ADMIN: [
      'company:create',
      'company:manageUsers',
      'company:setRoles',
      'company:configureApprovalRules',
      'expenses:viewAll',
      'expenses:overrideApprovals',
    ],
    ADMIN: [
      'company:create',
      'company:manageUsers',
      'company:setRoles',
      'company:configureApprovalRules',
      'expenses:viewAll',
      'expenses:overrideApprovals',
    ],
    MANAGER: [
      'expenses:approve',
      'expenses:reject',
      'expenses:viewTeam',
      'expenses:escalate',
    ],
    EMPLOYEE: [
      'expenses:submit',
      'expenses:viewOwn',
      'expenses:viewStatus',
    ],

  },
  getRolePermissions: (role) => options.rolePermissions[role] || [],
  can: (user, permission) => {
    if (!user || !user.role) return false;
    if (user.role === options.usersRoles.SUPER_ADMIN) return true;
    const permissions = options.getRolePermissions(user.role);
    return permissions.includes(permission);
  },
  genOtp: UtilHelper.genOtp,
  genRes: UtilHelper.genRes,
  generateCloudFrontUrl: UtilHelper.generateCloudFrontUrl,
  accessManagementType: {
    DASHBOARD: 'dashboard',
    ADMINS: 'admins',
    USER: 'user',
    PARENT: 'parent',
  },
  cronType: {},
  cronJobTimings: {},
};
module.exports = options;
