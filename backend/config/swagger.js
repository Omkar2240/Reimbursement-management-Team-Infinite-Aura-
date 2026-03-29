const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDocs = {
  adminSpec: {
    openapi: '3.0.0',
    info: {
      title: 'FlowExpense – Smart Reimbursement Engine Admin API Development',
      version: '1.0.0',
      description: 'This is a REST API application made with Express.',
      contact: {
        name: 'FlowExpense',
        email: 'support@flowexpense.com',
      },
    },
    persistAuthorization: true,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: `${process.env.BACKEND_URL}/api/v1/`,
        description: 'Development server',
      },
    ],
  },
  webSpec: {
    openapi: '3.0.0',
    info: {
      title:
        'FlowExpense – Smart Reimbursement Engine Web/Mobile API Development',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
      contact: {
        name: 'FlowExpense',
        url: 'support@flowexpense.com',
      },
    },
    basePath: '/api/v1',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: `${process.env.BACKEND_URL}/api/v1`,
        description: 'Development server',
      },
      {
        url: `${process.env.BACKEND_URL}/api/v1/admin`,
        description: 'Development Admin server',
      },
    ],
  },
};
const adminOptions = {
  swaggerDefinition: swaggerDocs.adminSpec,
  apis: ['api-docs/v1/admin/*.yaml'],
};
const webMobileOptions = {
  swaggerDefinition: swaggerDocs.webSpec,
  apis: ['api-docs/v1/web-mobile/*.yaml'],
};
module.exports.adminSetup = swaggerJSDoc(adminOptions);
module.exports.webMobileSetup = swaggerJSDoc(webMobileOptions);
