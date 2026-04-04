import swaggerJSDoc from 'swagger-jsdoc';
import { _config } from '../config/config.js';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zorvyn Finance API',
      version: '1.0.0',
      description: 'A production-ready finance management API with RBAC, analytics, and security.',
    },
    servers: [
      {
        url: `${_config.APP_URL}/api/v1`,
        description: 'Primary API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
 
  apis: ['./src/modules/**/*.ts', './src/app.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
