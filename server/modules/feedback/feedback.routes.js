const express = require('express');
const router = express.Router();
const feedbackController = require('./feedback.controller');
const { authenticate, authorize, optionalAuth } = require('../../middleware/auth.middleware');

// Public route to submit feedback
router.post('/', optionalAuth, feedbackController.submitFeedback);

// Admin routes
router.use(authenticate);
router.use(authorize('admin', 'superadmin'));

router.get('/', feedbackController.getAllFeedback);
router.patch('/:id', feedbackController.updateFeedbackStatus);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
