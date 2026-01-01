const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary if credentials exist
// Cloudinary will automatically read CLOUDINARY_URL from process.env if present
// process.env.CLOUDINARY_URL should be formatted as: cloudinary://api_key:api_secret@cloud_name

// As a fallback/helper, we can explicit set config if individual vars are used
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

// Determine storage engine
let storage;

// Check if we should use Cloudinary (if URL or Cloud Name is present)
const useCloudinary = process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME;

if (useCloudinary) {
    console.log('☁️ Using Cloudinary for file storage');
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'anti-hiv-aids-clubs', // folder name in cloudinary
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
            public_id: (req, file) => {
                const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
                return `${Date.now()}-${name}`;
            },
        },
    });
} else {
    // Fallback to Disk Storage
    console.log('💾 Using Local Disk for file storage');
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
}

// File filter (keep existing)
const fileFilter = (req, file, cb) => {
    // Accept images, videos, audio, and common document formats
    const allowedTypes = /\.(jpg|jpeg|png|gif|webp|svg|mp4|mov|avi|mpeg|mp3|wav|pdf|doc|docx|ppt|pptx|xls|xlsx|txt|rtf|zip|rar)$/i;

    if (!file.originalname.match(allowedTypes)) {
        return cb(new Error('File type not supported! Please upload images, videos, or documents.'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

class UploadController {
    // Middleware for handling single file upload
    uploadSingle(fieldName) {
        return upload.single(fieldName);
    }

    // Controller method to return the file URL
    handleUpload(req, res) {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Debug: log the uploaded file object to help diagnose storage provider response
        console.log('Uploaded file object:', req.file);

        // Construct public URL robustly supporting Cloudinary and local disk
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');

        let fileUrl = null;

        try {
            // Common Cloudinary/remote keys: path, url, secure_url
            if (req.file.path && typeof req.file.path === 'string' && req.file.path.match(/^https?:\/\//i)) {
                fileUrl = req.file.path;
            } else if (req.file.secure_url && typeof req.file.secure_url === 'string') {
                fileUrl = req.file.secure_url;
            } else if (req.file.url && typeof req.file.url === 'string' && req.file.url.match(/^https?:\/\//i)) {
                fileUrl = req.file.url;
            }

            // Fallback: if storage produced a filename (local disk) build a public URL
            if (!fileUrl) {
                // Local file fallback
                const filename = req.file.filename || req.file.public_id || req.file.originalname;
                if (host && filename) {
                    if (host.includes('onrender.com')) {
                        fileUrl = `https://${host}/uploads/${filename}`;
                    } else {
                        fileUrl = `${protocol}://${host}/uploads/${filename}`;
                    }
                }
            }
        } catch (err) {
            console.error('Error constructing file URL:', err);
        }

        // Ensure we always return a URL field (if we failed to construct one, return null)
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: fileUrl,
                filename: req.file.filename || req.file.public_id || req.file.originalname || null,
                mimetype: req.file.mimetype || null,
                size: req.file.size || null,
                // Include provider-specific metadata when available
                provider: useCloudinary ? 'cloudinary' : 'local',
                public_id: req.file.public_id || null,
                raw: req.file
            }
        });
    }
}

module.exports = new UploadController();
