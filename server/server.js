const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const constants = require('./config/constants');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Import routes
const userRoutes = require('./modules/users/user.routes');
const memberRoutes = require('./modules/members/member.routes');
const advisorRoutes = require('./modules/advisors/advisor.routes');
const peerEducatorRoutes = require('./modules/peerEducators/peerEducator.routes');
const eventRoutes = require('./modules/events/event.routes');
const anonymousQuestionRoutes = require('./modules/anonymousQuestions/anonymousQuestion.routes');

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet()); // Set security headers

// CORS Configuration
app.use(cors({
    origin: constants.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: constants.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
    max: constants.RATE_LIMIT_MAX_REQUESTS || 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware (Development)
if (constants.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: constants.NODE_ENV
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/advisors', advisorRoutes);
app.use('/api/peer-educators', peerEducatorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/questions', anonymousQuestionRoutes);

// Welcome Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Anti-HIV-AIDS-CLUBS API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// 404 Handler - Must be after all routes
app.use(notFound);

// Global Error Handler - Must be last
app.use(errorHandler);

// Start Server
const PORT = constants.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server running in ${constants.NODE_ENV} mode`);
    console.log(`📡 Server listening on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated');
    });
});

module.exports = app;
