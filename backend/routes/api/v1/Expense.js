const express = require('express');
const { checkSchema } = require('express-validator');

const router = express.Router();

const AuthHandler = require('../../../models/helpers/AuthHelper');
const ExpenseControl = require('../../../controllers/api/v1/Expense');
const ExpenseSchema = require('../../../schema-validation/Expense');
const ErrorHandleHelper = require('../../../models/helpers/ErrorHandleHelper');
const { usersRoles } = require('../../../config/options');
const { upload } = require('../../../models/helpers/MulterHelper');

router.get(
  '/',
  AuthHandler.authenticateJWT(usersRoles.getAllRolesAsArray()),
  ExpenseControl.getExpenses
);
router.get(
  '/pending-approvals',
  AuthHandler.authenticateJWT(usersRoles.getAllRolesAsArray()),
  ExpenseControl.getPendingApprovals
);
router.get(
  '/team-expenses',
  AuthHandler.authenticateJWT([
    usersRoles.SUPER_ADMIN,
    usersRoles.ADMIN,
    usersRoles.MANAGER,
  ]),
  ExpenseControl.getTeamExpenses
);
router.get(
  '/:id',
  AuthHandler.authenticateJWT(usersRoles.getAllRolesAsArray()),
  ExpenseControl.getExpense
);
router.get(
  '/:id/approval-chain',
  AuthHandler.authenticateJWT(usersRoles.getAllRolesAsArray()),
  ExpenseControl.getApprovalChain
);
router.get(
  '/:id/convert',
  AuthHandler.authenticateJWT(usersRoles.getAllRolesAsArray()),
  ExpenseControl.convertExpenseCurrency
);

router.post(
  '/',
  AuthHandler.authenticateJWT(usersRoles.getNonAdminArray()),
  checkSchema(ExpenseSchema.createExpense),
  ErrorHandleHelper.requestValidator,
  ExpenseControl.postExpense
);

router.post(
  '/:id/approve',
  AuthHandler.authenticateJWT([
    usersRoles.SUPER_ADMIN,
    usersRoles.ADMIN,
    usersRoles.MANAGER,
  ]),
  ExpenseControl.postApproveExpense
);

router.patch(
  '/:id/reject',
  AuthHandler.authenticateJWT([
    usersRoles.SUPER_ADMIN,
    usersRoles.ADMIN,
    usersRoles.MANAGER,
  ]),
  checkSchema(ExpenseSchema.rejectExpense),
  ErrorHandleHelper.requestValidator,
  ExpenseControl.postRejectExpense
);

router.post(
  '/:id/receipt',
  AuthHandler.authenticateJWT(usersRoles.getAllRolesAsArray()),
  upload.single('receipt'),
  ExpenseControl.uploadExpenseReceipt
);

module.exports = router;
