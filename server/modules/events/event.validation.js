const Joi = require('joi');

const speakerSchema = Joi.object({
    name: Joi.string().trim().optional(),
    title: Joi.string().trim().optional(),
    organization: Joi.string().trim().optional(),
    bio: Joi.string().max(500).optional(),
    photo: Joi.string().uri().optional()
});

const locationSchema = Joi.object({
    venue: Joi.string().required().trim(),
    address: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    coordinates: Joi.object({
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional()
    }).optional()
});

const createEventSchema = Joi.object({
    title: Joi.string().required().trim().max(200),
    description: Joi.string().required().max(2000),
    eventType: Joi.string().required().valid('workshop', 'seminar', 'conference', 'training', 'awareness_campaign', 'health_screening', 'fundraising', 'social', 'meeting', 'other'),
    category: Joi.string().valid('HIV/AIDS Awareness', 'Sexual Health', 'Mental Health', 'Substance Abuse Prevention', 'Gender-Based Violence', 'Reproductive Health', 'General Health', 'Community Outreach', 'Capacity Building', 'Other').optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    location: locationSchema.required(),
    organizers: Joi.array().items(Joi.string()).optional(),
    advisors: Joi.array().items(Joi.string()).optional(),
    speakers: Joi.array().items(speakerSchema).optional(),
    targetAudience: Joi.string().valid('students', 'staff', 'community', 'all').optional(),
    capacity: Joi.number().min(1).optional(),
    registrationRequired: Joi.boolean().optional(),
    registrationDeadline: Joi.date().optional(),
    budget: Joi.object({
        estimated: Joi.number().min(0).optional(),
        actual: Joi.number().min(0).optional()
    }).optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isFeatured: Joi.boolean().optional()
});

const updateEventSchema = Joi.object({
    title: Joi.string().trim().max(200).optional(),
    description: Joi.string().max(2000).optional(),
    eventType: Joi.string().valid('workshop', 'seminar', 'conference', 'training', 'awareness_campaign', 'health_screening', 'fundraising', 'social', 'meeting', 'other').optional(),
    category: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    location: locationSchema.optional(),
    organizers: Joi.array().items(Joi.string()).optional(),
    advisors: Joi.array().items(Joi.string()).optional(),
    speakers: Joi.array().items(speakerSchema).optional(),
    targetAudience: Joi.string().valid('students', 'staff', 'community', 'all').optional(),
    capacity: Joi.number().min(1).optional(),
    status: Joi.string().valid('draft', 'published', 'ongoing', 'completed', 'cancelled').optional(),
    registrationRequired: Joi.boolean().optional(),
    registrationDeadline: Joi.date().optional(),
    budget: Joi.object({
        estimated: Joi.number().min(0).optional(),
        actual: Joi.number().min(0).optional()
    }).optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isFeatured: Joi.boolean().optional(),
    isPublic: Joi.boolean().optional()
});

module.exports = { createEventSchema, updateEventSchema };
