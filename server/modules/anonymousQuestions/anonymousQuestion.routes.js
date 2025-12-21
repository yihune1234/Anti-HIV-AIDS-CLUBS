const express = require('express');
const router = express.Router();
const anonymousQuestionController = require('./anonymousQuestion.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createQuestionSchema, answerQuestionSchema, updateQuestionSchema } = require('./anonymousQuestion.validation');

// Public routes
router.post('/', validate(createQuestionSchema), anonymousQuestionController.createQuestion);
router.get('/', anonymousQuestionController.getAllQuestions);
router.get('/:id', anonymousQuestionController.getQuestionById);
router.post('/:id/helpful', anonymousQuestionController.markHelpful);

// Protected routes (admin/advisor only)
router.use(authenticate);

router.get('/stats', authorize('admin', 'advisor'), anonymousQuestionController.getQuestionStats);
router.post('/:id/answer', authorize('admin', 'advisor'), validate(answerQuestionSchema), anonymousQuestionController.answerQuestion);
router.put('/:id', authorize('admin'), validate(updateQuestionSchema), anonymousQuestionController.updateQuestion);
router.delete('/:id', authorize('admin'), anonymousQuestionController.deleteQuestion);

module.exports = router;
