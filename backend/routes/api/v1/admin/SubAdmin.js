const { Router } = require('express');

const router = Router();
const { checkSchema } = require('express-validator');

const {
  postCreateAdmin,
  getAdminListing,
  patchChangeStatus,
  deleteAdmin,
  getAdmin,
  patchAssignManager,
  getTeamMembers,
  putUpdateAdmin,
} = require('../../../../controllers/api/v1/admin/SubAdmin');

const {
  requestValidator,
} = require('../../../../models/helpers/ErrorHandleHelper');
const {
  createAdmin,
  updateAdmin,
  updateStatus,
} = require('../../../../schema-validation/admin/SubAdmin');

router.post('/', checkSchema(createAdmin), requestValidator, postCreateAdmin);
router.get('/', getAdminListing);
router.get('/:id', getAdmin);
router.put('/:id', checkSchema(updateAdmin), requestValidator, putUpdateAdmin);
router.patch('/:id', checkSchema(updateStatus), requestValidator, patchChangeStatus);
router.patch('/:id/manager', patchAssignManager);
router.get('/:id/team', getTeamMembers);
router.delete('/:id', deleteAdmin);

module.exports = router;
