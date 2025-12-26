const TrainingContent = require('../../models/TrainingContent');

class TrainingContentService {
    // Create new training content (Admin only)
    async createContent(contentData, createdBy) {
        const content = await TrainingContent.create({
            ...contentData,
            createdBy
        });
        return await content.populate('createdBy', 'firstName middleName lastName email');
    }

    // Get all content (filtered by access level for public/members)
    async getAllContent(filters = {}, userRole = 'public', page = 1, limit = 20) {
        const query = { isActive: true };
        
        // Access control
        if (userRole === 'public') {
            query.accessLevel = 'public';
        }
        
        if (filters.category) query.category = filters.category;
        if (filters.contentType) query.contentType = filters.contentType;
        if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
        if (filters.search) {
            query.$text = { $search: filters.search };
        }
        
        const skip = (page - 1) * limit;
        
        const [contents, total] = await Promise.all([
            TrainingContent.find(query)
                .populate('createdBy', 'firstName lastName')
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            TrainingContent.countDocuments(query)
        ]);

        return {
            contents,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalDocs: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        };
    }

    // Get content by ID
    async getContentById(contentId, userId = null) {
        const content = await TrainingContent.findById(contentId)
            .populate('createdBy', 'firstName middleName lastName email')
            .populate('relatedSessions', 'title date');
        
        if (!content) {
            throw new Error('Content not found');
        }

        // Increment view count
        content.viewCount += 1;
        await content.save();
        
        return content;
    }

    // Update content (Admin only)
    async updateContent(contentId, updateData, updatedBy) {
        const content = await TrainingContent.findByIdAndUpdate(
            contentId,
            { ...updateData, updatedBy },
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName');
        
        if (!content) {
            throw new Error('Content not found');
        }
        
        return content;
    }

    // Delete content (Admin only)
    async deleteContent(contentId) {
        const content = await TrainingContent.findByIdAndDelete(contentId);
        
        if (!content) {
            throw new Error('Content not found');
        }
        
        return content;
    }

    // Mark content as completed by user
    async markCompleted(contentId, userId, completionData = {}) {
        const content = await TrainingContent.findById(contentId);
        
        if (!content) {
            throw new Error('Content not found');
        }

        await content.markCompleted(
            userId,
            completionData.timeSpent,
            completionData.rating,
            completionData.feedback
        );

        return content;
    }

    // Get user's completed content
    async getUserCompletions(userId) {
        const contents = await TrainingContent.find({
            'completions.user': userId,
            isActive: true
        }).select('title category contentType completions');

        return contents.map(content => ({
            content: {
                _id: content._id,
                title: content.title,
                category: content.category,
                contentType: content.contentType
            },
            completion: content.completions.find(
                c => c.user.toString() === userId.toString()
            )
        }));
    }

    // Increment download count
    async incrementDownload(contentId) {
        const content = await TrainingContent.findByIdAndUpdate(
            contentId,
            { $inc: { downloadCount: 1 } },
            { new: true }
        );
        
        if (!content) {
            throw new Error('Content not found');
        }
        
        return content;
    }

    // Get content statistics
    async getContentStats() {
        const [
            totalContent,
            publicContent,
            membersOnlyContent,
            totalViews,
            totalDownloads,
            totalCompletions
        ] = await Promise.all([
            TrainingContent.countDocuments({ isActive: true }),
            TrainingContent.countDocuments({ isActive: true, accessLevel: 'public' }),
            TrainingContent.countDocuments({ isActive: true, accessLevel: 'members_only' }),
            TrainingContent.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: null, total: { $sum: '$viewCount' } } }
            ]),
            TrainingContent.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: null, total: { $sum: '$downloadCount' } } }
            ]),
            TrainingContent.aggregate([
                { $match: { isActive: true } },
                { $unwind: '$completions' },
                { $group: { _id: null, total: { $sum: 1 } } }
            ])
        ]);

        return {
            totalContent,
            publicContent,
            membersOnlyContent,
            totalViews: totalViews[0]?.total || 0,
            totalDownloads: totalDownloads[0]?.total || 0,
            totalCompletions: totalCompletions[0]?.total || 0
        };
    }

    // Get featured content
    async getFeaturedContent(userRole = 'public', limit = 5) {
        const query = { isActive: true, isFeatured: true };
        
        if (userRole === 'public') {
            query.accessLevel = 'public';
        }
        
        const contents = await TrainingContent.find(query)
            .populate('createdBy', 'firstName middleName lastName')
            .sort({ createdAt: -1 })
            .limit(limit);

        return contents;
    }
}

module.exports = new TrainingContentService();
