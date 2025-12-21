const Joi = require('joi');

/**
 * Validation schema for creating a new story.
 * 
 * Where to use:
 * - POST /api/stories
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.post('/', validate(createStorySchema), storyController.createStory);`
 */
const createStorySchema = Joi.object({
    title: Joi.string().required().max(200),
    content: Joi.string().required().max(5000),
    isAnonymous: Joi.boolean().default(false),
    category: Joi.string().valid(
        'personal_journey', 'recovery', 'awareness', 'prevention',
        'support', 'education', 'advocacy', 'inspiration', 'other'
    ).required(),
    tags: Joi.array().items(Joi.string()),
    featuredImage: Joi.string().allow(''),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string(),
            caption: Joi.string().max(200)
        })
    ),
    isPublic: Joi.boolean().default(true),
    metaDescription: Joi.string().allow('').max(160),
    status: Joi.string().valid('draft', 'pending_review').default('draft')
});

/**
 * Validation schema for updating an existing story.
 * 
 * Where to use:
 * - PUT /api/stories/:id
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.put('/:id', validate(updateStorySchema), storyController.updateStory);`
 */
const updateStorySchema = Joi.object({
    title: Joi.string().max(200),
    content: Joi.string().max(5000),
    isAnonymous: Joi.boolean(),
    category: Joi.string().valid(
        'personal_journey', 'recovery', 'awareness', 'prevention',
        'support', 'education', 'advocacy', 'inspiration', 'other'
    ),
    tags: Joi.array().items(Joi.string()),
    featuredImage: Joi.string().allow(''),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string(),
            caption: Joi.string().max(200)
        })
    ),
    isPublic: Joi.boolean(),
    metaDescription: Joi.string().allow('').max(160),
    status: Joi.string().valid('draft', 'pending_review', 'approved', 'published', 'rejected', 'archived'),
    reviewNotes: Joi.string().allow('').max(500)
});

/**
 * Validation schema for adding a comment to a story.
 * 
 * Where to use:
 * - POST /api/stories/:id/comments
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.post('/:id/comments', validate(addCommentSchema), storyController.addComment);`
 */
const addCommentSchema = Joi.object({
    content: Joi.string().required().max(500)
});

module.exports = {
    createStorySchema,
    updateStorySchema,
    addCommentSchema
};
