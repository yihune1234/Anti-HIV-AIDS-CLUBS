const contentService = require('./content.service');

class ContentController {
    // Create content (Admin only)
    async createContent(req, res) {
        try {
            const content = await contentService.createContent(req.body, req.user._id);
            res.status(201).json({
                success: true,
                message: 'Training content created successfully',
                data: content
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all content (Public/Members can view based on access level)
    async getAllContent(req, res) {
        try {
            const { category, contentType, isFeatured, search, page = 1, limit = 20 } = req.query;
            const filters = {};
            if (category) filters.category = category;
            if (contentType) filters.contentType = contentType;
            if (isFeatured) filters.isFeatured = isFeatured === 'true';
            if (search) filters.search = search;

            const userRole = req.user ? 'member' : 'public';
            const result = await contentService.getAllContent(filters, userRole, parseInt(page), parseInt(limit));

            res.status(200).json({
                success: true,
                data: result.contents,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get content by ID
    async getContentById(req, res) {
        try {
            const content = await contentService.getContentById(req.params.id, req.user?._id);
            res.status(200).json({
                success: true,
                data: content
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update content (Admin only)
    async updateContent(req, res) {
        try {
            const content = await contentService.updateContent(req.params.id, req.body, req.user._id);
            res.status(200).json({
                success: true,
                message: 'Content updated successfully',
                data: content
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete content (Admin only)
    async deleteContent(req, res) {
        try {
            await contentService.deleteContent(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Content deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Mark content as completed (Member action)
    async markCompleted(req, res) {
        try {
            const content = await contentService.markCompleted(
                req.params.id,
                req.user._id,
                req.body
            );
            res.status(200).json({
                success: true,
                message: 'Content marked as completed',
                data: content
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get user's completed content
    async getUserCompletions(req, res) {
        try {
            const completions = await contentService.getUserCompletions(req.user._id);
            res.status(200).json({
                success: true,
                data: completions
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Download content (increment counter)
    async downloadContent(req, res) {
        try {
            await contentService.incrementDownload(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Download recorded'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get content statistics (Admin only)
    async getContentStats(req, res) {
        try {
            const stats = await contentService.getContentStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get featured content
    async getFeaturedContent(req, res) {
        try {
            const userRole = req.user ? 'member' : 'public';
            const limit = parseInt(req.query.limit) || 5;
            const contents = await contentService.getFeaturedContent(userRole, limit);
            res.status(200).json({
                success: true,
                data: contents
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ContentController();
