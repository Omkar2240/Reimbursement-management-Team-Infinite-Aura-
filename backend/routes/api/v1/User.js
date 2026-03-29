const express = require('express');
const { checkSchema } = require('express-validator');

const router = express.Router();

const AuthHandler = require('../../../models/helpers/AuthHelper');
const UserControl = require('../../../controllers/api/v1/User');
const UserSchema = require('../../../schema-validation/User');
const ErrorHandleHelper = require('../../../models/helpers/ErrorHandleHelper');
const { usersRoles } = require('../../../config/options');

router.post(
  '/login',
  checkSchema(UserSchema.passwordLogin),
  ErrorHandleHelper.requestValidator,
  UserControl.login
);

router.post(
  '/sign-up',
  checkSchema(UserSchema.signUp),
  ErrorHandleHelper.requestValidator,
  UserControl.signup
);

router.post(
  '/send-otp',
  checkSchema(UserSchema.sendOtp),
  ErrorHandleHelper.requestValidator,
  UserControl.sendOtp
);

router.patch(
  '/verify-otp',
  checkSchema(UserSchema.verifyOtp),
  ErrorHandleHelper.requestValidator,
  UserControl.verifyOtp
);

router.put(
  '/',
  AuthHandler.authenticateJWT(),
  checkSchema(UserSchema.updateInfo),
  ErrorHandleHelper.requestValidator,
  UserControl.putUserProfile
);

router.get(
  '/',
  AuthHandler.authenticateJWT(usersRoles.getNonAdminArray()),
  UserControl.getUserProfile
);

router.post(
  '/send-reset-otp',
  checkSchema(UserSchema.sendOtpToEmail),
  ErrorHandleHelper.requestValidator,
  UserControl.sendOtpToResetPassword
);
router.patch(
  '/password',
  checkSchema(UserSchema.updatePasswordWithOtpEmail),
  ErrorHandleHelper.requestValidator,
  UserControl.patchUpdatePasswordWithOtp
);

router.patch(
  '/close-account',
  AuthHandler.authenticateJWT(),
  UserControl.deleteUserAccount
);

router.post(
  '/sso',
  checkSchema(UserSchema.sso),
  ErrorHandleHelper.requestValidator,
  UserControl.loginWitSSO
);

module.exports = router;
