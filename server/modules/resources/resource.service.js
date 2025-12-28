const Resource = require('../../models/Resource');

class ResourceService {
    async createResource(data, userId) {
        try {
            const resource = new Resource({
                ...data,
                uploadedBy: userId
            });
            await resource.save();
            return resource;
        } catch (error) {
            throw error;
        }
    }

    async getResourceById(id) {
        try {
            // Increment views
            const resource = await Resource.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } },
                { new: true }
            )
                .populate('uploadedBy', 'name email')
                .populate('verifiedBy', 'name')
                .populate('relatedResources', 'title resourceType')
                .populate('ratings.user', 'name profilePicture');

            if (!resource) throw new Error('Resource not found');
            return resource;
        } catch (error) {
            throw error;
        }
    }

    async getAllResources(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};
            if (filters.status) query.status = filters.status;
            if (filters.resourceType) query.resourceType = filters.resourceType;
            if (filters.category) query.category = filters.category;
            if (filters.accessLevel) query.accessLevel = filters.accessLevel;
            if (filters.language) query.language = filters.language;
            if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;

            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { 'author.name': { $regex: filters.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(filters.search, 'i')] } }
                ];
            }

            const skip = (page - 1) * limit;
            const resources = await Resource.find(query)
                .populate('uploadedBy', 'name')
                .skip(skip)
                .limit(limit)
                .sort({ publishDate: -1 });

            const total = await Resource.countDocuments(query);
            return { resources, pagination: { total, page, pages: Math.ceil(total / limit), limit } };
        } catch (error) {
            throw error;
        }
    }

    async updateResource(id, data, userId) {
        try {
            const resource = await Resource.findByIdAndUpdate(
                id,
                { $set: { ...data, lastUpdated: Date.now() } },
                { new: true, runValidators: true }
            );
            if (!resource) throw new Error('Resource not found');
            return resource;
        } catch (error) {
            throw error;
        }
    }

    async deleteResource(id) {
        try {
            const resource = await Resource.findByIdAndDelete(id);
            if (!resource) throw new Error('Resource not found');
            return { message: 'Resource deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async verifyResource(id, verifierId) {
        try {
            const resource = await Resource.findByIdAndUpdate(
                id,
                {
                    isVerified: true,
                    verifiedBy: verifierId,
                    verificationDate: Date.now(),
                    status: 'published' // Auto publish on verification? Or separate step. Assuming verification implies OK to publish.
                },
                { new: true }
            );
            if (!resource) throw new Error('Resource not found');
            return resource;
        } catch (error) {
            throw error;
        }
    }

    async addReview(id, userId, reviewData) {
        try {
            const resource = await Resource.findById(id);
            if (!resource) throw new Error('Resource not found');

            // Check if user already reviewed
            const existingReview = resource.ratings.find(r => r.user.toString() === userId.toString());
            if (existingReview) {
                // Update existing review
                existingReview.rating = reviewData.rating;
                existingReview.review = reviewData.review;
                existingReview.createdAt = Date.now();
            } else {
                // Add new review
                resource.ratings.push({
                    user: userId,
                    ...reviewData
                });
            }

            await resource.save();
            return await Resource.findById(id).populate('ratings.user', 'name profilePicture');
        } catch (error) {
            throw error;
        }
    }

    async downloadResource(id) {
        try {
            const resource = await Resource.findByIdAndUpdate(
                id,
                { $inc: { downloads: 1 } },
                { new: true }
            );
            if (!resource) throw new Error('Resource not found');
            return resource;
        } catch (error) {
            throw error;
        }
    }

    // Mark resource as completed
    async markCompleted(resourceId, userId, completionData = {}) {
        try {
            const resource = await Resource.findById(resourceId);
            if (!resource) throw new Error('Resource not found');
            
            await resource.markCompleted(userId, completionData.timeSpent, completionData.feedback);
            return resource;
        } catch (error) {
            throw error;
        }
    }

    // Get user's completed resources
    async getUserCompletions(userId) {
        try {
            const resources = await Resource.find({
                'completions.user': userId
            }).select('title category resourceType completions');

            return resources.map(resource => ({
                resource: {
                    _id: resource._id,
                    title: resource.title,
                    category: resource.category,
                    resourceType: resource.resourceType
                },
                completion: resource.completions.find(
                    c => c.user.toString() === userId.toString()
                )
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ResourceService();
