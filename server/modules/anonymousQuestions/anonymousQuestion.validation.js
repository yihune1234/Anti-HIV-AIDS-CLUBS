const Joi = require('joi');

const createQuestionSchema = Joi.object({
    question: Joi.string().required().trim().max(1000),
    category: Joi.string().required().valid(
        'HIV/AIDS', 'Sexual Health', 'Mental Health', 'Substance Abuse',
        'Relationships', 'Prevention', 'Treatment', 'Testing', 'Stigma', 'Support', 'General Health', 'Other'
    ),
    tags: Joi.array().items(Joi.string().trim()).optional()
});

const answerQuestionSchema = Joi.object({
    content: Joi.string().required().max(3000),
    isVerified: Joi.boolean().optional()
});

const updateQuestionSchema = Joi.object({
    status: Joi.string().valid('pending', 'approved', 'answered', 'rejected', 'archived').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    isPublished: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    moderatorNotes: Joi.string().max(500).optional()
});

module.exports = { createQuestionSchema, answerQuestionSchema, updateQuestionSchema };
