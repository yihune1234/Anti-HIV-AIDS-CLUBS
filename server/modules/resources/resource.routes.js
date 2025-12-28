const express = require('express');
const router = express.Router();
const resourceController = require('./resource.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createResourceSchema, updateResourceSchema, addReviewSchema } = require('./resource.validation');

// Public routes
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);

// Protected routes
router.use(authenticate);

// Regular members can track downloads, add reviews, and mark completion
router.post('/:id/download', resourceController.downloadResource);
router.post('/:id/reviews', validate(addReviewSchema), resourceController.addReview);
router.post('/:id/complete', resourceController.markCompleted);
router.get('/my/completions', resourceController.getUserCompletions);

// Admin/Advisor/PeerEducator management routes
router.post('/', authorize('admin', 'advisor', 'peer_educator'), validate(createResourceSchema), resourceController.createResource);
router.put('/:id', authorize('admin', 'advisor', 'peer_educator'), validate(updateResourceSchema), resourceController.updateResource);
router.delete('/:id', authorize('admin', 'advisor'), resourceController.deleteResource);

// Verification route (Admin/Advisor only)
router.patch('/:id/verify', authorize('admin', 'advisor'), resourceController.verifyResource);

module.exports = router;
