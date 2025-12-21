const Joi = require('joi');

/**
 * Validation schema for creating a new resource.
 * 
 * Where to use:
 * - POST /api/resources
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.post('/', validate(createResourceSchema), resourceController.createResource);`
 */
const createResourceSchema = Joi.object({
    title: Joi.string().required().max(200),
    description: Joi.string().required().max(1000),
    resourceType: Joi.string().valid(
        'document', 'video', 'audio', 'infographic', 'presentation',
        'link', 'book', 'article', 'toolkit', 'guideline', 'other'
    ).required(),
    category: Joi.string().valid(
        'HIV/AIDS Information', 'Sexual Health', 'Mental Health',
        'Substance Abuse', 'Gender-Based Violence', 'Reproductive Health',
        'Prevention', 'Treatment', 'Support Services', 'Research',
        'Training Materials', 'Other'
    ).required(),
    fileUrl: Joi.string().allow('').when('resourceType', {
        is: Joi.valid('link', 'video', 'audio'),
        then: Joi.optional(),
        otherwise: Joi.optional() // Can be optional if externalUrl is provided
    }),
    externalUrl: Joi.string().uri().allow(''),
    fileName: Joi.string().allow(''),
    fileSize: Joi.number().min(0),
    mimeType: Joi.string().allow(''),
    thumbnailUrl: Joi.string().allow(''),
    author: Joi.object({
        name: Joi.string().allow(''),
        organization: Joi.string().allow('')
    }),
    language: Joi.string().default('English'),
    targetAudience: Joi.array().items(Joi.string().valid(
        'students', 'educators', 'healthcare_workers',
        'general_public', 'researchers', 'policymakers'
    )),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'pending_review', 'approved', 'published', 'archived').default('draft'),
    accessLevel: Joi.string().valid('public', 'members_only', 'restricted').default('public'),
    isFeatured: Joi.boolean().default(false),
    metadata: Joi.object({
        isbn: Joi.string().allow(''),
        doi: Joi.string().allow(''),
        publisher: Joi.string().allow(''),
        publicationYear: Joi.number(),
        edition: Joi.string().allow(''),
        pageCount: Joi.number(),
        duration: Joi.number()
    })
});

/**
 * Validation schema for updating an existing resource.
 * 
 * Where to use:
 * - PUT /api/resources/:id
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.put('/:id', validate(updateResourceSchema), resourceController.updateResource);`
 */
const updateResourceSchema = Joi.object({
    title: Joi.string().max(200),
    description: Joi.string().max(1000),
    resourceType: Joi.string().valid(
        'document', 'video', 'audio', 'infographic', 'presentation',
        'link', 'book', 'article', 'toolkit', 'guideline', 'other'
    ),
    category: Joi.string().valid(
        'HIV/AIDS Information', 'Sexual Health', 'Mental Health',
        'Substance Abuse', 'Gender-Based Violence', 'Reproductive Health',
        'Prevention', 'Treatment', 'Support Services', 'Research',
        'Training Materials', 'Other'
    ),
    fileUrl: Joi.string().allow(''),
    externalUrl: Joi.string().uri().allow(''),
    fileName: Joi.string().allow(''),
    fileSize: Joi.number().min(0),
    mimeType: Joi.string().allow(''),
    thumbnailUrl: Joi.string().allow(''),
    author: Joi.object({
        name: Joi.string().allow(''),
        organization: Joi.string().allow('')
    }),
    language: Joi.string(),
    targetAudience: Joi.array().items(Joi.string().valid(
        'students', 'educators', 'healthcare_workers',
        'general_public', 'researchers', 'policymakers'
    )),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'pending_review', 'approved', 'published', 'archived'),
    accessLevel: Joi.string().valid('public', 'members_only', 'restricted'),
    isFeatured: Joi.boolean(),
    metadata: Joi.object({
        isbn: Joi.string().allow(''),
        doi: Joi.string().allow(''),
        publisher: Joi.string().allow(''),
        publicationYear: Joi.number(),
        edition: Joi.string().allow(''),
        pageCount: Joi.number(),
        duration: Joi.number()
    })
});

/**
 * Validation schema for adding a review to a resource.
 * 
 * Where to use:
 * - POST /api/resources/:id/reviews
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.post('/:id/reviews', validate(addReviewSchema), resourceController.addReview);`
 */
const addReviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    review: Joi.string().max(500)
});

module.exports = {
    createResourceSchema,
    updateResourceSchema,
    addReviewSchema
};
