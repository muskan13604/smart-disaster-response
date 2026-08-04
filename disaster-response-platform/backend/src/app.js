const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { sendResponse } = require('./utils/response.util');

// Routes
const authRoutes = require('./routes/auth.routes');
const disasterRoutes = require('./routes/disaster.routes');
const sosRoutes = require('./routes/sos.routes');
const path = require('path');

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Disaster Response API',
            version: '1.0.0',
            description: 'API for Smart Disaster Response & Resource Allocation Platform'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/sos', sosRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 Handler
app.use((req, res, next) => {
    sendResponse(res, 404, false, 'Route not found');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    sendResponse(res, 500, false, 'Server Error', {}, [{ msg: err.message }]);
});

module.exports = app;
