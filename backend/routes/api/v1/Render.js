const express = require('express');
const router = express.Router();

const RenderCtrl = require('../../../controllers/api/v1/RenderEmail');

router.get('/:type', RenderCtrl.render);

module.exports = router;
