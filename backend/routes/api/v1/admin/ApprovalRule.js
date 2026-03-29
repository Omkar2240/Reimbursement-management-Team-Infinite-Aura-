const { Router } = require('express');
const { checkSchema } = require('express-validator');

const router = Router();

const {
  postCreateRule,
  getRuleListing,
  putUpdateRule,
  deleteRule,
} = require('../../../../controllers/api/v1/admin/ApprovalRule');

const {
  requestValidator,
} = require('../../../../models/helpers/ErrorHandleHelper');
const {
  createRule,
  updateRule,
} = require('../../../../schema-validation/admin/ApprovalRule');

router.post('/', checkSchema(createRule), requestValidator, postCreateRule);
router.get('/:companyId', getRuleListing);
router.put('/:id', checkSchema(updateRule), requestValidator, putUpdateRule);
router.delete('/:id', deleteRule);

module.exports = router;
