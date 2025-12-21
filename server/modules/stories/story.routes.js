const express = require('express');
const router = express.Router();
const storyController = require('./story.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createStorySchema, updateStorySchema, addCommentSchema } = require('./story.validation');

// Public routes
router.get('/', storyController.getAllStories);
router.get('/slug/:slug', storyController.getStoryBySlug);
router.get('/:id', storyController.getStoryById);

// Protected routes
router.use(authenticate);

// Creation - authenticated users can create stories (might need approval)
router.post('/', validate(createStorySchema), storyController.createStory);

// Interaction
router.post('/:id/like', storyController.toggleLike);
router.post('/:id/comments', validate(addCommentSchema), storyController.addComment);

// Management (Author or Admin/Advisor)
// Ideally need ownership middleware. For now, authorize admin/advisor for broad update/delete, or rely on service check
router.put('/:id', authorize('admin', 'advisor', 'peer_educator'), validate(updateStorySchema), storyController.updateStory);
router.delete('/:id', authorize('admin', 'advisor'), storyController.deleteStory);

// Approval (Admin/Advisor only)
router.patch('/:id/approve', authorize('admin', 'advisor'), storyController.approveStory);

module.exports = router;
