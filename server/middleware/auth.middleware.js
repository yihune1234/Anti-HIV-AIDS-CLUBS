const jwt = require('jsonwebtoken');
const User = require('../models/User');

const constants = require('../config/constants');

// Authenticate user with JWT
const authenticate = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please provide a valid token'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || constants.JWT_SECRET || 'your-secret-key');

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

// Authorize user based on roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Support both single role (old) and roles array (new)
        // Combine all possible sources of roles
        const userRoles = new Set();

        if (req.user.role) userRoles.add(req.user.role);
        if (Array.isArray(req.user.roles)) {
            req.user.roles.forEach(r => userRoles.add(r));
        }

        // Debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Auth] Checking access for user ${req.user.username}. Required: [${roles}], User has: [${Array.from(userRoles)}]`);
        }

        const hasRole = roles.some(role => userRoles.has(role));

        if (!hasRole) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this access'
            });
        }

        next();
    };
};

// Alias for better naming
const restrictTo = authorize;

// Check if user is admin
const isAdmin = (req, res, next) => {
    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
    if (!userRoles.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                const user = await User.findById(decoded.id).select('-password');
                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (error) {
                // Token invalid, but continue without user
            }
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    authenticate,
    authorize,
    optionalAuth,
    protect: authenticate,
    restrictTo,
    isAdmin
};
