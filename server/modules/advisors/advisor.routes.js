const express = require('express');
const router = express.Router();
const advisorController = require('./advisor.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createAdvisorSchema, updateAdvisorSchema } = require('./advisor.validation');

router.use(authenticate);

router.get('/stats', authorize('admin'), advisorController.getAdvisorStats);
router.get('/', advisorController.getAllAdvisors);
router.get('/:id', advisorController.getAdvisorById);
router.post('/', authorize('admin'), validate(createAdvisorSchema), advisorController.createAdvisor);
router.put('/:id', authorize('admin'), validate(updateAdvisorSchema), advisorController.updateAdvisor);
router.delete('/:id', authorize('admin'), advisorController.deleteAdvisor);

module.exports = router;
