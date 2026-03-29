const express = require('express');

const router = express.Router();
const { checkSchema } = require('express-validator');

const SharedControl = require('../../../controllers/api/v1/Shared');
const AuthHandler = require('../../../models/helpers/AuthHelper');
const roles = require('../../../config/options').usersRoles;
const SharedSchema = require('../../../schema-validation/Shared');
const ErrorHandleHelper = require('../../../models/helpers/ErrorHandleHelper');
const { upload } = require('../../../models/helpers/MulterHelper');

router.post(
  '/upload',
  AuthHandler.authenticateJWT(roles.getAllRolesAsArray()),
  upload.single('file'),
  SharedControl.postUploadMedia
);

router.get(
  '/signed-url',
  AuthHandler.authenticateJWT(roles.getAllRolesAsArray()),
  checkSchema(SharedSchema.generateUrl),
  ErrorHandleHelper.requestValidator,
  SharedControl.getPostSignedURL
);

module.exports = router;
