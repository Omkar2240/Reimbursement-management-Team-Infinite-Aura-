const { Router } = require('express');
const { checkSchema } = require('express-validator');

const router = Router();

const {
  getCompanyListing,
  postCreateCompany,
  getCompany,
  putUpdateCompany,
} = require('../../../../controllers/api/v1/admin/Company');

const {
  requestValidator,
} = require('../../../../models/helpers/ErrorHandleHelper');
const {
  createCompany,
  updateCompany,
} = require('../../../../schema-validation/admin/Company');

router.get('/', getCompanyListing);
router.post('/', checkSchema(createCompany), requestValidator, postCreateCompany);
router.get('/:id', getCompany);
router.put('/:id', checkSchema(updateCompany), requestValidator, putUpdateCompany);

module.exports = router;
