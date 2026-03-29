const express = require('express');
const router = express.Router();
const AuthHandler = require('../../../../models/helpers/AuthHelper');

const UserRouter = require('./User');
const SubAdminRouter = require('./SubAdmin');
const ContactUsRouter = require('./ContactUs');
const { usersRoles } = require('../../../../config/options');

router.use(
  '/contact-us',
  AuthHandler.authenticateJWT(usersRoles.getAdminArray()),
  ContactUsRouter
);

router.use('/user', UserRouter);

router.use('/sub-admin', SubAdminRouter);

module.exports = router;
