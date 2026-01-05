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
    isOnline: Joi.boolean().optional().default(false),
    onlineLink: Joi.string().uri().trim().allow('').optional(),
    coordinates: Joi.object({
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional()
    }).optional()
});

const bannerImageSchema = Joi.object({
    url: Joi.string().uri().required(),
    caption: Joi.string().max(200).allow('').optional()
});

const createEventSchema = Joi.object({
    title: Joi.string().required().trim().max(200),
    description: Joi.string().required().max(2000),
    eventType: Joi.string().required().valid('workshop', 'seminar', 'conference', 'training', 'awareness_campaign', 'health_screening', 'fundraising', 'social', 'meeting', 'other'),
    category: Joi.string().valid('HIV/AIDS Awareness', 'Sexual Health', 'Mental Health', 'Substance Abuse Prevention', 'Gender-Based Violence', 'Reproductive Health', 'General Health', 'Community Outreach', 'Capacity Building', 'Other').optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required().greater(Joi.ref('startDate')),
    startTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    registrationOpenDate: Joi.date().required(),
    registrationCloseDate: Joi.date().required().greater(Joi.ref('registrationOpenDate')),
    location: locationSchema.required(),
    bannerImage: bannerImageSchema.required(),
    organizers: Joi.array().items(Joi.string()).optional(),
    advisors: Joi.array().items(Joi.string()).optional(),
    speakers: Joi.array().items(speakerSchema).optional(),
    targetAudience: Joi.array().items(Joi.string().valid('students', 'staff', 'community', 'all', 'freshmen', 'sophomores', 'juniors', 'seniors')).optional().default(['all']),
    capacity: Joi.number().min(1).optional(),
    registrationRequired: Joi.boolean().optional().default(true),
    allowCancellation: Joi.boolean().optional().default(true),
    status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').optional().default('upcoming'),
    budget: Joi.object({
        estimated: Joi.number().min(0).optional(),
        actual: Joi.number().min(0).optional()
    }).optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isFeatured: Joi.boolean().optional().default(false),
    isPublic: Joi.boolean().optional().default(true),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().required(),
            caption: Joi.string().allow('').max(200).optional()
        })
    ).optional()
});

const updateEventSchema = Joi.object({
    title: Joi.string().trim().max(200).optional(),
    description: Joi.string().max(2000).optional(),
    eventType: Joi.string().valid('workshop', 'seminar', 'conference', 'training', 'awareness_campaign', 'health_screening', 'fundraising', 'social', 'meeting', 'other').optional(),
    category: Joi.string().valid('HIV/AIDS Awareness', 'Sexual Health', 'Mental Health', 'Substance Abuse Prevention', 'Gender-Based Violence', 'Reproductive Health', 'General Health', 'Community Outreach', 'Capacity Building', 'Other').optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    registrationOpenDate: Joi.date().optional(),
    registrationCloseDate: Joi.date().optional(),
    location: locationSchema.optional(),
    bannerImage: bannerImageSchema.optional(),
    organizers: Joi.array().items(Joi.string()).optional(),
    advisors: Joi.array().items(Joi.string()).optional(),
    speakers: Joi.array().items(speakerSchema).optional(),
    targetAudience: Joi.array().items(Joi.string().valid('students', 'staff', 'community', 'all', 'freshmen', 'sophomores', 'juniors', 'seniors')).optional(),
    capacity: Joi.number().min(1).optional(),
    status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').optional(),
    registrationRequired: Joi.boolean().optional(),
    allowCancellation: Joi.boolean().optional(),
    budget: Joi.object({
        estimated: Joi.number().min(0).optional(),
        actual: Joi.number().min(0).optional()
    }).optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isFeatured: Joi.boolean().optional(),
    isPublic: Joi.boolean().optional(),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().required(),
            caption: Joi.string().allow('').max(200).optional()
        })
    ).optional()
}).min(1);

module.exports = { createEventSchema, updateEventSchema };
