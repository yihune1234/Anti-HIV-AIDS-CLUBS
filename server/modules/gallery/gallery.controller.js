const galleryService = require('./gallery.service');

class GalleryController {
    async createGallery(req, res, next) {
        try {
            const gallery = await galleryService.createGallery(req.body, req.user._id);
            res.status(201).json({
                success: true,
                data: gallery
            });
        } catch (error) {
            next(error);
        }
    }

    async getGalleryById(req, res, next) {
        try {
            const gallery = await galleryService.getGalleryById(req.params.id);
            res.status(200).json({
                success: true,
                data: gallery
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllGalleries(req, res, next) {
        try {
            const result = await galleryService.getAllGalleries(
                req.query,
                parseInt(req.query.page) || 1,
                parseInt(req.query.limit) || 10
            );
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateGallery(req, res, next) {
        try {
            const gallery = await galleryService.updateGallery(req.params.id, req.body, req.user._id);
            res.status(200).json({
                success: true,
                data: gallery
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteGallery(req, res, next) {
        try {
            const result = await galleryService.deleteGallery(req.params.id, req.user._id);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleLike(req, res, next) {
        try {
            const gallery = await galleryService.toggleLike(req.params.id, req.user._id);
            res.status(200).json({
                success: true,
                data: gallery
            });
        } catch (error) {
            next(error);
        }
    }

    async addComment(req, res, next) {
        try {
            const comment = await galleryService.addComment(req.params.id, req.user._id, req.body?.content);
            res.status(201).json({
                success: true,
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            const result = await galleryService.deleteComment(req.params.id, req.params.commentId, req.user._id);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GalleryController();
