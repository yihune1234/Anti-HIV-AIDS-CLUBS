const resourceService = require('./resource.service');

class ResourceController {
    async createResource(req, res, next) {
        try {
            const resource = await resourceService.createResource(req.body, req.user._id);
            res.status(201).json({
                success: true,
                data: resource
            });
        } catch (error) {
            next(error);
        }
    }

    async getResourceById(req, res, next) {
        try {
            const resource = await resourceService.getResourceById(req.params.id);
            res.status(200).json({
                success: true,
                data: resource
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllResources(req, res, next) {
        try {
            const result = await resourceService.getAllResources(
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

    async updateResource(req, res, next) {
        try {
            const resource = await resourceService.updateResource(req.params.id, req.body, req.user._id);
            res.status(200).json({
                success: true,
                data: resource
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteResource(req, res, next) {
        try {
            const result = await resourceService.deleteResource(req.params.id);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyResource(req, res, next) {
        try {
            const resource = await resourceService.verifyResource(req.params.id, req.user._id);
            res.status(200).json({
                success: true,
                data: resource
            });
        } catch (error) {
            next(error);
        }
    }

    async addReview(req, res, next) {
        try {
            const resource = await resourceService.addReview(req.params.id, req.user._id, req.body);
            res.status(200).json({
                success: true,
                data: resource
            });
        } catch (error) {
            next(error);
        }
    }

    async downloadResource(req, res, next) {
        try {
            const resource = await resourceService.downloadResource(req.params.id);
            // In a real scenario, this might stream the file or return a signed URL
            // For now, we return the resource data including fileUrl which user can use
            res.status(200).json({
                success: true,
                data: resource,
                message: 'Download tracked'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ResourceController();
