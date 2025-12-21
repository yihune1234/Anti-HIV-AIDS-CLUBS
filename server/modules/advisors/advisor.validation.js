const Joi = require('joi');

const qualificationSchema = Joi.object({
    degree: Joi.string().trim().optional(),
    institution: Joi.string().trim().optional(),
    year: Joi.number().integer().optional()
});

const publicationSchema = Joi.object({
    title: Joi.string().trim().optional(),
    journal: Joi.string().trim().optional(),
    year: Joi.number().integer().optional(),
    url: Joi.string().uri().optional()
});

const createAdvisorSchema = Joi.object({
    user: Joi.string().required().messages({ 'any.required': 'User reference is required' }),
    staffId: Joi.string().required().trim().messages({ 'any.required': 'Staff ID is required' }),
    title: Joi.string().valid('Dr.', 'Prof.', 'Mr.', 'Mrs.', 'Ms.', 'Mx.').required(),
    department: Joi.string().required().trim(),
    faculty: Joi.string().required().trim(),
    officeLocation: Joi.string().trim().optional(),
    officeHours: Joi.string().trim().optional(),
    specialization: Joi.string().trim().optional(),
    qualifications: Joi.array().items(qualificationSchema).optional(),
    advisorType: Joi.string().valid('primary', 'secondary', 'technical', 'honorary').optional(),
    areasOfExpertise: Joi.array().items(Joi.string().trim()).optional(),
    researchInterests: Joi.array().items(Joi.string().trim()).optional(),
    publications: Joi.array().items(publicationSchema).optional(),
    bio: Joi.string().max(1000).optional()
});

const updateAdvisorSchema = Joi.object({
    title: Joi.string().valid('Dr.', 'Prof.', 'Mr.', 'Mrs.', 'Ms.', 'Mx.').optional(),
    department: Joi.string().trim().optional(),
    faculty: Joi.string().trim().optional(),
    officeLocation: Joi.string().trim().optional(),
    officeHours: Joi.string().trim().optional(),
    specialization: Joi.string().trim().optional(),
    qualifications: Joi.array().items(qualificationSchema).optional(),
    advisorType: Joi.string().valid('primary', 'secondary', 'technical', 'honorary').optional(),
    areasOfExpertise: Joi.array().items(Joi.string().trim()).optional(),
    researchInterests: Joi.array().items(Joi.string().trim()).optional(),
    publications: Joi.array().items(publicationSchema).optional(),
    bio: Joi.string().max(1000).optional(),
    isActive: Joi.boolean().optional()
});

module.exports = {
    createAdvisorSchema,
    updateAdvisorSchema
};
