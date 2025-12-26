const Joi = require('joi');

// Validation for creating a session
const createSessionSchema = Joi.object({
    title: Joi.string().required().max(200).trim(),
    description: Joi.string().required().max(1000),
    topic: Joi.string().required().valid(
        'HIV/AIDS Awareness',
        'Sexual Health',
        'Mental Health',
        'Substance Abuse Prevention',
        'Gender-Based Violence',
        'Reproductive Health',
        'STI Prevention',
        'Healthy Relationships',
        'Consent Education',
        'Life Skills',
        'Stress Management',
        'Other'
    ),
    sessionType: Joi.string().required().valid(
        'workshop',
        'seminar',
        'group_discussion',
        'one_on_one',
        'presentation',
        'interactive',
        'online',
        'other'
    ),
    educators: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional().default([]),
    date: Joi.date().required(),
    startTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    location: Joi.object({
        venue: Joi.string().required().trim(),
        room: Joi.string().trim().allow('').optional(),
        building: Joi.string().trim().allow('').optional(),
        isOnline: Joi.boolean().optional().default(false),
        onlineLink: Joi.string().uri().trim().allow('').optional()
    }).required(),
    targetAudience: Joi.array().items(
        Joi.string().valid(
            'freshmen',
            'sophomores',
            'juniors',
            'seniors',
            'all_students',
            'specific_department',
            'mixed',
            'staff',
            'community'
        )
    ).optional(),
    departments: Joi.array().items(Joi.string().trim()).optional(),
    expectedParticipants: Joi.number().min(0).optional().default(0),
    objectives: Joi.array().items(Joi.string().trim()).optional(),
    methodologies: Joi.array().items(
        Joi.string().valid(
            'lecture',
            'discussion',
            'role_play',
            'case_study',
            'demonstration',
            'group_work',
            'multimedia',
            'games',
            'other'
        )
    ).optional(),
    requiresRegistration: Joi.boolean().optional(),
    registrationDeadline: Joi.date().optional(),
    status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').optional().default('upcoming')
});

// Validation for updating a session
const updateSessionSchema = Joi.object({
    title: Joi.string().max(200).trim(),
    description: Joi.string().max(1000),
    topic: Joi.string().valid(
        'HIV/AIDS Awareness',
        'Sexual Health',
        'Mental Health',
        'Substance Abuse Prevention',
        'Gender-Based Violence',
        'Reproductive Health',
        'STI Prevention',
        'Healthy Relationships',
        'Consent Education',
        'Life Skills',
        'Stress Management',
        'Other'
    ),
    sessionType: Joi.string().valid(
        'workshop',
        'seminar',
        'group_discussion',
        'one_on_one',
        'presentation',
        'interactive',
        'online',
        'other'
    ),
    educators: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    date: Joi.date(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    location: Joi.object({
        venue: Joi.string().trim(),
        room: Joi.string().trim().allow('').optional(),
        building: Joi.string().trim().allow('').optional(),
        isOnline: Joi.boolean().optional(),
        onlineLink: Joi.string().uri().trim().allow('').optional()
    }),
    targetAudience: Joi.array().items(
        Joi.string().valid(
            'freshmen',
            'sophomores',
            'juniors',
            'seniors',
            'all_students',
            'specific_department',
            'mixed',
            'staff',
            'community'
        )
    ).optional(),
    departments: Joi.array().items(Joi.string().trim()).optional(),
    expectedParticipants: Joi.number().min(0).optional(),
    objectives: Joi.array().items(Joi.string().trim()).optional(),
    methodologies: Joi.array().items(
        Joi.string().valid(
            'lecture',
            'discussion',
            'role_play',
            'case_study',
            'demonstration',
            'group_work',
            'multimedia',
            'games',
            'other'
        )
    ).optional(),
    status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').optional(),
    requiresRegistration: Joi.boolean().optional(),
    registrationDeadline: Joi.date().optional()
}).min(1);

// Validation for marking attendance
const markAttendanceSchema = Joi.object({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    attended: Joi.boolean().required()
});

// Middleware to validate request body
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        next();
    };
};

module.exports = {
    createSessionSchema,
    updateSessionSchema,
    markAttendanceSchema,
    validate
};
