const express = require('express');
const { checkSchema } = require('express-validator');

const router = express.Router();

const ContactUsControl = require('../../../controllers/api/v1/ContactUs');
const ContactUsSchema = require('../../../schema-validation/ContactUs');
const ErrorHandleHelper = require('../../../models/helpers/ErrorHandleHelper');

router.post(
  '/',
  checkSchema(ContactUsSchema.contactUs),
  ErrorHandleHelper.requestValidator,
  ContactUsControl.postContactUs
);

module.exports = router;
