const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const multer = require('multer');

// Create a simple memory storage for direct upload
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ 
    storage: memoryStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(jpg|jpeg|png|gif|webp|svg|mp4|mov|avi|mpeg|mp3|wav|pdf|doc|docx|ppt|pptx|xls|xlsx|txt|rtf|zip|rar)$/i;
        if (!file.originalname.match(allowedTypes)) {
            return cb(new Error('File type not supported! Please upload images, videos, or documents.'), false);
        }
        cb(null, true);
    }
});

// Protected route - only authenticated users can upload
router.post('/', authenticate, uploadController.uploadSingle('file'), uploadController.handleUpload);

// Alternative direct upload route using Cloudinary service
router.post('/direct', authenticate, memoryUpload.single('file'), uploadController.handleDirectUpload);

// Test endpoint to check upload configuration
router.get('/test-config', (req, res) => {
    const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL);
    res.json({
        success: true,
        data: {
            hasCloudinary,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
            apiKey: process.env.CLOUDINARY_API_KEY ? 'configured' : 'missing',
            apiSecret: process.env.CLOUDINARY_API_SECRET ? 'configured' : 'missing',
            cloudinaryUrl: process.env.CLOUDINARY_URL ? 'configured' : 'missing',
            nodeEnv: process.env.NODE_ENV
        }
    });
});

// Development-only unprotected test route to quickly verify storage (Cloudinary/local)
if (process.env.NODE_ENV !== 'production') {
	router.post('/test', uploadController.uploadSingle('file'), uploadController.handleUpload);
	router.post('/test-direct', memoryUpload.single('file'), uploadController.handleDirectUpload);
}

module.exports = router;
