const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
    async uploadImage(file, folder = 'anti-hiv-club') {
        try {
            let uploadOptions = {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            };

            let result;
            
            // Handle different file input types
            if (file.buffer) {
                // File from memory storage (multer)
                result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }).end(file.buffer);
                });
            } else if (file.path) {
                // File from disk storage
                result = await cloudinary.uploader.upload(file.path, uploadOptions);
            } else {
                throw new Error('Invalid file format - no buffer or path found');
            }

            return {
                success: true,
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    bytes: result.bytes
                }
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return {
                success: false,
                message: 'Failed to upload image',
                error: error.message
            };
        }
    }

    async uploadDocument(file, folder = 'anti-hiv-club/documents') {
        try {
            let uploadOptions = {
                folder: folder,
                resource_type: 'raw',
                use_filename: true,
                unique_filename: true
            };

            let result;
            
            // Handle different file input types
            if (file.buffer) {
                // File from memory storage (multer)
                result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }).end(file.buffer);
                });
            } else if (file.path) {
                // File from disk storage
                result = await cloudinary.uploader.upload(file.path, uploadOptions);
            } else {
                throw new Error('Invalid file format - no buffer or path found');
            }

            return {
                success: true,
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    originalName: result.original_filename,
                    format: result.format,
                    bytes: result.bytes
                }
            };
        } catch (error) {
            console.error('Cloudinary document upload error:', error);
            return {
                success: false,
                message: 'Failed to upload document',
                error: error.message
            };
        }
    }

    async deleteFile(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return {
                success: result.result === 'ok',
                message: result.result === 'ok' ? 'File deleted successfully' : 'File not found'
            };
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            return {
                success: false,
                message: 'Failed to delete file',
                error: error.message
            };
        }
    }

    async getImageUrl(publicId, transformations = {}) {
        try {
            const url = cloudinary.url(publicId, {
                ...transformations,
                secure: true
            });
            return { success: true, url };
        } catch (error) {
            console.error('Cloudinary URL generation error:', error);
            return {
                success: false,
                message: 'Failed to generate image URL',
                error: error.message
            };
        }
    }

    // Generate optimized URLs for different use cases
    getThumbnailUrl(publicId, width = 300, height = 200) {
        return cloudinary.url(publicId, {
            width,
            height,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true
        });
    }

    getProfileImageUrl(publicId, size = 150) {
        return cloudinary.url(publicId, {
            width: size,
            height: size,
            crop: 'fill',
            gravity: 'face',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true
        });
    }

    getBannerImageUrl(publicId, width = 1200, height = 400) {
        return cloudinary.url(publicId, {
            width,
            height,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true
        });
    }
}

module.exports = new CloudinaryService();