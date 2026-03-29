const swaggerUi = require('swagger-ui-express');
const router = require('express').Router();

const swagger = require('../../../config/swagger');

const admin = swaggerUi.generateHTML(swagger.adminSetup);
router.use('', swaggerUi.serveFiles(swagger.adminSetup, { swaggerOptions: { displayRequestDuration: true } }));
router.get('', (req, res) => res.send(admin));

module.exports = router;
