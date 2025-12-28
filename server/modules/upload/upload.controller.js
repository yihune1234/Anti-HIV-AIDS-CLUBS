const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit matching app limit
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

        // Construct public URL
        // In production (Render), req.protocol might be 'http' due to proxying,
        // so we check x-forwarded-proto or just force https if host contains onrender.com
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');

        let fileUrl;
        if (host.includes('onrender.com')) {
            fileUrl = `https://${host}/uploads/${req.file.filename}`;
        } else {
            fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: fileUrl,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    }
}

module.exports = new UploadController();
