const Story = require('../../models/Story');

class StoryService {
    async createStory(data, userId) {
        try {
            const story = new Story({
                ...data,
                author: userId
            });
            await story.save();
            return story;
        } catch (error) {
            throw error;
        }
    }

    async getStoryById(id) {
        try {
            const story = await Story.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } },
                { new: true }
            )
                .populate('author', 'firstName lastName profileImage') // Do not expose email/phone effectively if anonymous
                .populate('reviewedBy', 'firstName lastName')
                .populate('likes', 'firstName lastName')
                .populate({
                    path: 'comments',
                    populate: { path: 'user', select: 'firstName lastName profileImage' }
                });

            if (!story) throw new Error('Story not found');

            // If anonymous, mask author details in the response processing if needed
            // But usually populated fields are returned. We'll handle masking in controller or here if needed.
            // For now, assuming standard population. Privacy can be enforced by checking isAnonymous.

            return story;
        } catch (error) {
            throw error;
        }
    }

    async getStoryBySlug(slug) {
        try {
            const story = await Story.findOne({ slug })
                .populate('author', 'firstName lastName profileImage')
                .populate('likes', 'firstName lastName')
                .populate({
                    path: 'comments',
                    populate: { path: 'user', select: 'firstName lastName profileImage' }
                });

            if (!story) throw new Error('Story not found');
            return story;
        } catch (error) {
            throw error;
        }
    }

    async getAllStories(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};
            if (filters.status && filters.status !== 'all') {
                query.status = filters.status;
            } else if (!filters.status) {
                query.status = 'published'; // Default to published only for public list
            }
            // if status is 'all', query.status is not set, meaning it will return all statuses

            if (filters.category) query.category = filters.category;
            if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
            if (filters.author) query.author = filters.author;

            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { content: { $regex: filters.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(filters.search, 'i')] } }
                ];
            }

            const skip = (page - 1) * limit;
            const stories = await Story.find(query)
                .populate('author', 'firstName lastName profileImage')
                .populate({
                    path: 'comments.user',
                    select: 'firstName lastName profileImage'
                })
                .skip(skip)
                .limit(limit)
                .sort({ publishDate: -1 });

            const total = await Story.countDocuments(query);
            return { stories, pagination: { total, page, pages: Math.ceil(total / limit), limit } };
        } catch (error) {
            throw error;
        }
    }

    async updateStory(id, data, userId) {
        try {
            const story = await Story.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true, runValidators: true }
            ).populate('author', 'firstName lastName profileImage');

            if (!story) throw new Error('Story not found');
            return story;
        } catch (error) {
            throw error;
        }
    }

    async deleteStory(id) {
        try {
            const story = await Story.findByIdAndDelete(id);
            if (!story) throw new Error('Story not found');
            return { message: 'Story deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async toggleLike(id, userId) {
        try {
            const story = await Story.findById(id);
            if (!story) throw new Error('Story not found');

            const index = story.likes.indexOf(userId);
            if (index === -1) {
                story.likes.push(userId);
            } else {
                story.likes.splice(index, 1);
            }

            await story.save();
            return story;
        } catch (error) {
            throw error;
        }
    }

    async addComment(id, userId, content) {
        try {
            const story = await Story.findById(id);
            if (!story) throw new Error('Story not found');

            story.comments.push({
                user: userId,
                content,
                isApproved: false // Require approval for comments? Default schema says false.
            });

            await story.save();
            // Return updated story or the comment
            const updatedStory = await Story.findById(id)
                .populate('comments.user', 'firstName lastName profileImage');
            return updatedStory.comments[updatedStory.comments.length - 1];
        } catch (error) {
            throw error;
        }
    }

    async approveStory(id, reviewerId, notes) {
        try {
            const story = await Story.findByIdAndUpdate(
                id,
                {
                    status: 'published',
                    reviewedBy: reviewerId,
                    reviewDate: Date.now(),
                    reviewNotes: notes,
                    publishDate: Date.now()
                },
                { new: true }
            );
            if (!story) throw new Error('Story not found');
            return story;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StoryService();
