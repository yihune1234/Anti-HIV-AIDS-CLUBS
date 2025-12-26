const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { authenticate } = require('../../middleware/auth.middleware');

// Protected route - only authenticated users can upload
router.post('/', authenticate, uploadController.uploadSingle('file'), uploadController.handleUpload);

module.exports = router;
