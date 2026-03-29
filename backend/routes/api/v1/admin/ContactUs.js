const express = require('express');
const { checkSchema } = require('express-validator');

const router = express.Router();

const ContactUsControl = require('../../../../controllers/api/v1/admin/ContactUs');
const ContactUsSchema = require('../../../../schema-validation/admin/ContactUs');
const ErrorHandleHelper = require('../../../../models/helpers/ErrorHandleHelper');

router.get(
  '/',
  checkSchema(ContactUsSchema.listContactUs),
  ErrorHandleHelper.requestValidator,
  ContactUsControl.getContactUsList
);

module.exports = router;
