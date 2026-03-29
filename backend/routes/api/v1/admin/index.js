const express = require('express');
const router = express.Router();
const AuthHandler = require('../../../../models/helpers/AuthHelper');

const UserRouter = require('./User');
const SubAdminRouter = require('./SubAdmin');
const ContactUsRouter = require('./ContactUs');
const CompanyRouter = require('./Company');
const ApprovalRuleRouter = require('./ApprovalRule');
const { usersRoles } = require('../../../../config/options');

router.use(
  '/contact-us',
  AuthHandler.authenticateJWT(usersRoles.getAdminArray()),
  ContactUsRouter
);

router.use('/user', UserRouter);

router.use(
  '/sub-admin',
  AuthHandler.authenticateJWT(usersRoles.getAdminArray()),
  SubAdminRouter
);

router.use(
  '/company',
  AuthHandler.authenticateJWT(usersRoles.getAdminArray()),
  CompanyRouter
);

router.use(
  '/approval-rule',
  AuthHandler.authenticateJWT(usersRoles.getAdminArray()),
  ApprovalRuleRouter
);

module.exports = router;
