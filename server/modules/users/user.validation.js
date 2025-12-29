const Joi = require('joi');

// Register validation
/**
 * Validation schema for user registration.
 * 
 * Where to use:
 * - POST /api/users/register
 * 
 * How to use:
 * - Use with the `validate` middleware.
 * - Example: `router.post('/register', validate(registerSchema), userController.register);`
 */
const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 50 characters',
            'any.required': 'Username is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        }),
    firstName: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'First name is required'
        }),
    lastName: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Last name is required'
        }),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number (10-15 digits)'
        }),
    department: Joi.string().trim().optional(),
    year: Joi.number().min(1).max(7).optional(),
    studentId: Joi.string().trim().optional(),
    role: Joi.string()
        .valid('admin', 'member', 'advisor', 'peer_educator')
        .optional()
});

// Login validation
/**
 * Validation schema for user login.
 * 
 * Where to use:
 * - POST /api/users/login
 * 
 * How to use:
 * - Use with the `validate` middleware.
 * - Example: `router.post('/login', validate(loginSchema), userController.login);`
 */
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Update profile validation
/**
 * Validation schema for updating user profile.
 * 
 * Where to use:
 * - PUT /api/users/profile
 * 
 * How to use:
 * - Use with the `validate` middleware.
 * - Example: `router.put('/profile', validate(updateProfileSchema), userController.updateProfile);`
 */
const updateProfileSchema = Joi.object({
    firstName: Joi.string().trim().optional(),
    middleName: Joi.string().trim().allow('').optional(),
    lastName: Joi.string().trim().optional(),
    username: Joi.string().min(3).max(50).trim().optional(),
    email: Joi.string().email().lowercase().trim().optional(),
    department: Joi.string().trim().optional(),
    year: Joi.number().min(1).max(7).optional(),
    bio: Joi.string().max(500).allow('').optional(),
    studentId: Joi.string().trim().optional(),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .allow('')
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number (10-15 digits)'
        }),
    profileImage: Joi.string().uri().allow('').optional()
});

// Change password validation
/**
 * Validation schema for changing password.
 * 
 * Where to use:
 * - POST /api/users/change-password
 * 
 * How to use:
 * - Use with the `validate` middleware.
 * - Example: `router.post('/change-password', validate(changePasswordSchema), userController.changePassword);`
 */
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'any.required': 'Current password is required'
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'New password must be at least 6 characters long',
            'any.required': 'New password is required'
        })
});

// Forgot password validation
/**
 * Validation schema for forgot password request.
 * 
 * Where to use:
 * - POST /api/users/forgot-password
 * 
 * How to use:
 * - Use with the `validate` middleware.
 * - Example: `router.post('/forgot-password', validate(forgotPasswordSchema), userController.forgotPassword);`
 */
const forgotPasswordSchema = Joi.object({
    identity: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Username or Student ID is required',
            'string.empty': 'Username or Student ID cannot be empty'
        }),
    contact: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Email or Phone Number is required',
            'string.empty': 'Email or Phone Number cannot be empty'
        })
});

// Reset password validation
/**
 * Validation schema for resetting password.
 * 
 * Where to use:
 * - POST /api/users/reset-password
 * 
 * How to use:
 * - Use with the `validate` middleware.
 * - Example: `router.post('/reset-password', validate(resetPasswordSchema), userController.resetPassword);`
 */
const resetPasswordSchema = Joi.object({
    contact: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Email or Phone Number is required',
            'string.empty': 'Email or Phone Number cannot be empty'
        }),
    otp: Joi.string()
        .required()
        .trim()
        .length(6)
        .pattern(/^[0-9]+$/)
        .messages({
            'any.required': 'OTP is required',
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must be numeric',
            'string.empty': 'OTP cannot be empty'
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'New password must be at least 6 characters long',
            'any.required': 'New password is required',
            'string.empty': 'New password cannot be empty'
        })
});

// Update role validation (admin only)
/**
 * Validation schema for updating user role.
 * 
 * Where to use:
 * - PUT /api/users/:id/role
 * 
 * How to use:
 * - Use with the `validate` middleware.
 * - Example: `router.put('/:id/role', validate(updateRoleSchema), userController.updateUserRole);`
 */
const updateRoleSchema = Joi.object({
    role: Joi.string()
        .valid('admin', 'member', 'advisor', 'peer_educator')
        .required()
        .messages({
            'any.required': 'Role is required',
            'any.only': 'Invalid role specified'
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateRoleSchema
};
