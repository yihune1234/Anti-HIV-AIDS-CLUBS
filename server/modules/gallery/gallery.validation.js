const Joi = require('joi');

/**
 * Validation schema for creating a new gallery.
 * 
 * Where to use:
 * - POST /api/gallery
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.post('/', validate(createGallerySchema), galleryController.createGallery);`
 */
const createGallerySchema = Joi.object({
    title: Joi.string().required().max(200),
    description: Joi.string().allow('').max(1000),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().required(),
            caption: Joi.string().allow('').max(200),
            altText: Joi.string().allow('').max(100),
            order: Joi.number().default(0)
        })
    ).min(1),
    albumType: Joi.string().valid('event', 'activity', 'awareness_campaign', 'training', 'general', 'other').default('general'),
    relatedEvent: Joi.string().allow(null),
    tags: Joi.array().items(Joi.string()),
    location: Joi.object({
        venue: Joi.string().allow(''),
        city: Joi.string().allow('')
    }),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
    visibility: Joi.string().valid('public', 'members_only', 'private').default('public'),
    isFeatured: Joi.boolean().default(false)
});

/**
 * Validation schema for updating an existing gallery.
 * 
 * Where to use:
 * - PUT /api/gallery/:id
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.put('/:id', validate(updateGallerySchema), galleryController.updateGallery);`
 */
const updateGallerySchema = Joi.object({
    title: Joi.string().max(200),
    description: Joi.string().allow('').max(1000),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().required(),
            caption: Joi.string().allow('').max(200),
            altText: Joi.string().allow('').max(100),
            order: Joi.number()
        })
    ),
    albumType: Joi.string().valid('event', 'activity', 'awareness_campaign', 'training', 'general', 'other'),
    relatedEvent: Joi.string().allow(null),
    tags: Joi.array().items(Joi.string()),
    location: Joi.object({
        venue: Joi.string().allow(''),
        city: Joi.string().allow('')
    }),
    status: Joi.string().valid('draft', 'published', 'archived'),
    visibility: Joi.string().valid('public', 'members_only', 'private'),
    isFeatured: Joi.boolean()
});

/**
 * Validation schema for adding a comment to a gallery.
 * 
 * Where to use:
 * - POST /api/gallery/:id/comments
 * 
 * How to use:
 * - Use with the `validate` middleware in the route definition.
 * - Example: `router.post('/:id/comments', validate(addCommentSchema), galleryController.addComment);`
 */
const addCommentSchema = Joi.object({
    content: Joi.string().required().max(300)
});

module.exports = {
    createGallerySchema,
    updateGallerySchema,
    addCommentSchema
};
