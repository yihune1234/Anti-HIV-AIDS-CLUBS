const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { authenticate } = require('../../middleware/auth.middleware');

// Protected route - only authenticated users can upload
router.post('/', authenticate, uploadController.uploadSingle('file'), uploadController.handleUpload);

// Development-only unprotected test route to quickly verify storage (Cloudinary/local)
if (process.env.NODE_ENV !== 'production') {
	router.post('/test', uploadController.uploadSingle('file'), uploadController.handleUpload);
}

module.exports = router;
