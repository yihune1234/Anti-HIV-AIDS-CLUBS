const Joi = require('joi');

const trainingSchema = Joi.object({
    trainingName: Joi.string().required().trim(),
    trainingDate: Joi.date().required(),
    trainingProvider: Joi.string().trim().optional(),
    certificateUrl: Joi.string().uri().optional(),
    hoursCompleted: Joi.number().min(0).optional()
});

const createPeerEducatorSchema = Joi.object({
    member: Joi.string().required(),
    certificationDate: Joi.date().required(),
    certificationNumber: Joi.string().trim().optional(),
    certificationExpiry: Joi.date().optional(),
    trainingCompleted: Joi.array().items(trainingSchema).optional(),
    specializations: Joi.array().items(Joi.string().valid(
        'HIV/AIDS Awareness', 'Sexual Health', 'Mental Health', 'Substance Abuse',
        'Gender-Based Violence', 'Reproductive Health', 'STI Prevention', 'Counseling', 'First Aid', 'Other'
    )).optional(),
    preferredTopics: Joi.array().items(Joi.string().trim()).optional(),
    languagesSpoken: Joi.array().items(Joi.string().trim()).optional()
});

const updatePeerEducatorSchema = Joi.object({
    certificationExpiry: Joi.date().optional(),
    trainingCompleted: Joi.array().items(trainingSchema).optional(),
    specializations: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('active', 'inactive', 'on_leave', 'suspended').optional(),
    performanceRating: Joi.number().min(1).max(5).optional(),
    totalHoursDelivered: Joi.number().min(0).optional(),
    studentsReached: Joi.number().min(0).optional(),
    availability: Joi.object({
        monday: Joi.boolean().optional(),
        tuesday: Joi.boolean().optional(),
        wednesday: Joi.boolean().optional(),
        thursday: Joi.boolean().optional(),
        friday: Joi.boolean().optional(),
        saturday: Joi.boolean().optional(),
        sunday: Joi.boolean().optional()
    }).optional(),
    preferredTopics: Joi.array().items(Joi.string().trim()).optional(),
    languagesSpoken: Joi.array().items(Joi.string().trim()).optional(),
    notes: Joi.string().max(1000).optional()
});

module.exports = { createPeerEducatorSchema, updatePeerEducatorSchema };
