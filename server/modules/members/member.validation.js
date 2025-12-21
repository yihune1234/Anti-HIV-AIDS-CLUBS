const Joi = require('joi');

// Create member validation
const createMemberSchema = Joi.object({
    user: Joi.string()
        .required()
        .messages({
            'any.required': 'User reference is required'
        }),
    studentId: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Student ID is required'
        }),
    department: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Department is required'
        }),
    yearOfStudy: Joi.number()
        .integer()
        .min(1)
        .max(7)
        .required()
        .messages({
            'number.min': 'Year of study must be at least 1',
            'number.max': 'Year of study cannot exceed 7',
            'any.required': 'Year of study is required'
        }),
    position: Joi.string()
        .valid('member', 'coordinator', 'secretary', 'treasurer', 'president', 'vice_president')
        .optional(),
    interests: Joi.array().items(Joi.string().trim()).optional(),
    skills: Joi.array().items(Joi.string().trim()).optional(),
    emergencyContact: Joi.object({
        name: Joi.string().trim().optional(),
        relationship: Joi.string().trim().optional(),
        phoneNumber: Joi.string()
            .pattern(/^[0-9]{10,15}$/)
            .optional()
            .messages({
                'string.pattern.base': 'Please provide a valid phone number (10-15 digits)'
            })
    }).optional(),
    bio: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Bio cannot exceed 500 characters'
        })
});

// Update member validation
const updateMemberSchema = Joi.object({
    department: Joi.string().trim().optional(),
    yearOfStudy: Joi.number().integer().min(1).max(7).optional(),
    membershipStatus: Joi.string()
        .valid('active', 'inactive', 'suspended', 'graduated')
        .optional(),
    position: Joi.string()
        .valid('member', 'coordinator', 'secretary', 'treasurer', 'president', 'vice_president')
        .optional(),
    interests: Joi.array().items(Joi.string().trim()).optional(),
    skills: Joi.array().items(Joi.string().trim()).optional(),
    volunteerHours: Joi.number().min(0).optional(),
    emergencyContact: Joi.object({
        name: Joi.string().trim().optional(),
        relationship: Joi.string().trim().optional(),
        phoneNumber: Joi.string()
            .pattern(/^[0-9]{10,15}$/)
            .optional()
    }).optional(),
    bio: Joi.string().max(500).optional()
});

// Add event attendance validation
const addEventAttendanceSchema = Joi.object({
    eventId: Joi.string()
        .required()
        .messages({
            'any.required': 'Event ID is required'
        })
});

// Add session attendance validation
const addSessionAttendanceSchema = Joi.object({
    sessionId: Joi.string()
        .required()
        .messages({
            'any.required': 'Session ID is required'
        })
});

module.exports = {
    createMemberSchema,
    updateMemberSchema,
    addEventAttendanceSchema,
    addSessionAttendanceSchema
};
