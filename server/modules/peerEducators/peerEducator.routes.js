const express = require('express');
const router = express.Router();
const peerEducatorController = require('./peerEducator.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createPeerEducatorSchema, updatePeerEducatorSchema } = require('./peerEducator.validation');

router.use(authenticate);

router.get('/stats', authorize('admin'), peerEducatorController.getPeerEducatorStats);
router.get('/', peerEducatorController.getAllPeerEducators);
router.get('/:id', peerEducatorController.getPeerEducatorById);
router.post('/', authorize('admin'), validate(createPeerEducatorSchema), peerEducatorController.createPeerEducator);
router.put('/:id', authorize('admin'), validate(updatePeerEducatorSchema), peerEducatorController.updatePeerEducator);
router.delete('/:id', authorize('admin'), peerEducatorController.deletePeerEducator);

module.exports = router;
