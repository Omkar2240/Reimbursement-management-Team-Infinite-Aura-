const express = require('express');

const router = express.Router();

const User = require('./User');
const SharedRouter = require('./Shared');
const AdminRouter = require('./admin/index');
const RenderRouter = require('./Render');
const CompanyRouter = require('./Company');
const ContactUsRouter = require('./ContactUs');

router.use('/render', RenderRouter);
router.use('/user', User);
router.use('/company', CompanyRouter);
router.use('/contact-us', ContactUsRouter);

router.use('/shared', SharedRouter);

router.use('/admin', AdminRouter);

module.exports = router;
