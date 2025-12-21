const storyService = require('./story.service');

class StoryController {
    async createStory(req, res, next) {
        try {
            const story = await storyService.createStory(req.body, req.user._id);
            res.status(201).json({
                success: true,
                data: story
            });
        } catch (error) {
            next(error);
        }
    }

    async getStoryById(req, res, next) {
        try {
            const story = await storyService.getStoryById(req.params.id);
            res.status(200).json({
                success: true,
                data: story
            });
        } catch (error) {
            next(error);
        }
    }

    async getStoryBySlug(req, res, next) {
        try {
            const story = await storyService.getStoryBySlug(req.params.slug);
            res.status(200).json({
                success: true,
                data: story
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllStories(req, res, next) {
        try {
            const result = await storyService.getAllStories(
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

    async updateStory(req, res, next) {
        try {
            // Check ownership logic should probably be here or service
            // For now, assuming middleware handles role check or service implies author check if strict
            const story = await storyService.updateStory(req.params.id, req.body, req.user._id);
            res.status(200).json({
                success: true,
                data: story
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteStory(req, res, next) {
        try {
            const result = await storyService.deleteStory(req.params.id);
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
            const story = await storyService.toggleLike(req.params.id, req.user._id);
            res.status(200).json({
                success: true,
                data: story
            });
        } catch (error) {
            next(error);
        }
    }

    async addComment(req, res, next) {
        try {
            const result = await storyService.addComment(req.params.id, req.user._id, req.body.content);
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async approveStory(req, res, next) {
        try {
            const story = await storyService.approveStory(req.params.id, req.user._id, req.body.reviewNotes);
            res.status(200).json({
                success: true,
                data: story
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StoryController();
