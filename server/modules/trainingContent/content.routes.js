const express = require('express');
const router = express.Router();
const contentController = require('./content.controller');
const { authenticate, authorize, optionalAuth } = require('../../middleware/auth.middleware');
const { validate, createContentSchema, updateContentSchema, markCompletedSchema } = require('./content.validation');

// Public/Member routes (with optional auth to check access level)
router.get('/', optionalAuth, contentController.getAllContent);
router.get('/featured', optionalAuth, contentController.getFeaturedContent);
router.get('/:id', optionalAuth, contentController.getContentById);

// Member routes (authenticated users)
router.post('/:id/complete', authenticate, validate(markCompletedSchema), contentController.markCompleted);
router.get('/my/completions', authenticate, contentController.getUserCompletions);
router.post('/:id/download', authenticate, contentController.downloadContent);

// Admin routes
router.post('/admin/create', authenticate, authorize('admin'), validate(createContentSchema), contentController.createContent);
router.put('/admin/:id', authenticate, authorize('admin'), validate(updateContentSchema), contentController.updateContent);
router.delete('/admin/:id', authenticate, authorize('admin'), contentController.deleteContent);
router.get('/admin/stats/overview', authenticate, authorize('admin'), contentController.getContentStats);

module.exports = router;
