const { Router } = require('express');

const router = Router();
const { checkSchema } = require('express-validator');

const {
  postCreateAdmin,
  getAdminListing,
  patchChangeStatus,
  deleteAdmin,
  getAdmin,
  putUpdateAdmin,
} = require('../../../../controllers/api/v1/admin/SubAdmin');

const {
  requestValidator,
} = require('../../../../models/helpers/ErrorHandleHelper');
const {
  createAdmin,
  updateAdmin,
} = require('../../../../schema-validation/admin/SubAdmin');

router.post('/', checkSchema(createAdmin), requestValidator, postCreateAdmin);
router.get('/', getAdminListing);
router.get('/:id', getAdmin);
router.put('/:id', checkSchema(updateAdmin), requestValidator, putUpdateAdmin);
router.patch('/:id', patchChangeStatus);
router.delete('/:id', deleteAdmin);

module.exports = router;
