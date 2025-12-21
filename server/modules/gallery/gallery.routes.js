const express = require('express');
const router = express.Router();
const galleryController = require('./gallery.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createGallerySchema, updateGallerySchema, addCommentSchema } = require('./gallery.validation');

// Public routes (if any, e.g. view specific public galleries)
router.get('/', galleryController.getAllGalleries);
router.get('/:id', galleryController.getGalleryById);

// Protected routes
router.use(authenticate);

router.post('/', authorize('admin', 'advisor'), validate(createGallerySchema), galleryController.createGallery);
router.put('/:id', authorize('admin', 'advisor'), validate(updateGallerySchema), galleryController.updateGallery);
router.delete('/:id', authorize('admin'), galleryController.deleteGallery);

router.post('/:id/like', galleryController.toggleLike);
router.post('/:id/comments', validate(addCommentSchema), galleryController.addComment);
router.delete('/:id/comments/:commentId', galleryController.deleteComment);

module.exports = router;
