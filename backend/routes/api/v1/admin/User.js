const { Router } = require('express');

const router = Router();
const { authenticateJWT } = require('../../../../models/helpers/AuthHelper');
const {
  loginAdmin,
  getUserProfile,
  sendOtpToResetPassword,
  patchUpdatePasswordWithOtp,
  putUserUpdate,
} = require('../../../../controllers/api/v1/admin/User');
const { usersRoles } = require('../../../../config/options');
const { checkSchema } = require('express-validator');

const ErrorHandleHelper = require('../../../../models/helpers/ErrorHandleHelper');
const {
  emailLogin,
  sendOtpToEmail,
  updatePasswordWithOtpEmail,
  updateAdmin,
} = require('../../../../schema-validation/admin/User');

router.post(
  '/login',
  checkSchema(emailLogin),
  ErrorHandleHelper.requestValidator,
  loginAdmin
);

router.get('/', authenticateJWT(usersRoles.getAdminArray()), getUserProfile);

router.put(
  '/',
  authenticateJWT(usersRoles.getAdminArray()),
  checkSchema(updateAdmin),
  ErrorHandleHelper.requestValidator,
  putUserUpdate
);

router.post(
  '/send-otp',
  checkSchema(sendOtpToEmail),
  ErrorHandleHelper.requestValidator,
  sendOtpToResetPassword
);
router.patch(
  '/password',
  checkSchema(updatePasswordWithOtpEmail),
  ErrorHandleHelper.requestValidator,
  patchUpdatePasswordWithOtp
);

module.exports = router;
