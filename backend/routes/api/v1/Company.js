const express = require('express');

const router = express.Router();
const CompanyControl = require('../../../controllers/api/v1/Company');

router.get('/', CompanyControl.getActiveCompaniesList);

module.exports = router;
