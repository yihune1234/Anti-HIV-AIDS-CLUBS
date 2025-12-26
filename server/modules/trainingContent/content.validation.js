const Joi = require('joi');

const createContentSchema = Joi.object({
    title: Joi.string().required().max(200).trim(),
    description: Joi.string().required().max(2000),
    contentType: Joi.string().required().valid('video', 'slides', 'document', 'infographic', 'guideline', 'manual', 'article', 'other'),
    category: Joi.string().required().valid(
        'HIV/AIDS Awareness', 'Prevention Methods', 'Sexual Health', 'Mental Health',
        'Substance Abuse', 'Gender-Based Violence', 'Reproductive Health',
        'STI Prevention', 'Life Skills', 'Other'
    ),
    accessLevel: Joi.string().valid('public', 'members_only').default('members_only'),
    fileUrl: Joi.string().uri().trim().allow('').optional(),
    videoUrl: Joi.string().uri().trim().allow('').optional(),
    externalLink: Joi.string().uri().trim().allow('').optional(),
    thumbnailUrl: Joi.string().uri().trim().allow('').optional(),
    duration: Joi.number().min(0).optional(),
    downloadable: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    author: Joi.string().trim().allow('').optional(),
    source: Joi.string().trim().allow('').optional(),
    publishedDate: Joi.date().optional(),
    isFeatured: Joi.boolean().optional()
});

const updateContentSchema = Joi.object({
    title: Joi.string().max(200).trim(),
    description: Joi.string().max(2000),
    contentType: Joi.string().valid('video', 'slides', 'document', 'infographic', 'guideline', 'manual', 'article', 'other'),
    category: Joi.string().valid(
        'HIV/AIDS Awareness', 'Prevention Methods', 'Sexual Health', 'Mental Health',
        'Substance Abuse', 'Gender-Based Violence', 'Reproductive Health',
        'STI Prevention', 'Life Skills', 'Other'
    ),
    accessLevel: Joi.string().valid('public', 'members_only'),
    fileUrl: Joi.string().uri().trim().allow(''),
    videoUrl: Joi.string().uri().trim().allow(''),
    externalLink: Joi.string().uri().trim().allow(''),
    thumbnailUrl: Joi.string().uri().trim().allow(''),
    duration: Joi.number().min(0),
    downloadable: Joi.boolean(),
    tags: Joi.array().items(Joi.string().trim()),
    author: Joi.string().trim().allow(''),
    source: Joi.string().trim().allow(''),
    publishedDate: Joi.date(),
    isActive: Joi.boolean(),
    isFeatured: Joi.boolean()
}).min(1);

const markCompletedSchema = Joi.object({
    timeSpent: Joi.number().min(0).optional(),
    rating: Joi.number().min(1).max(5).optional(),
    feedback: Joi.string().max(500).optional()
});

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
    createContentSchema,
    updateContentSchema,
    markCompletedSchema,
    validate
};
