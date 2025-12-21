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
    lastName: Joi.string().trim().optional(),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number (10-15 digits)'
        }),
    profileImage: Joi.string().uri().optional()
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
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
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
    token: Joi.string()
        .required()
        .messages({
            'any.required': 'Reset token is required'
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'New password must be at least 6 characters long',
            'any.required': 'New password is required'
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
