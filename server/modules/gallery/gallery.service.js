const Gallery = require('../../models/Gallery');

class GalleryService {
    async createGallery(data, userId) {
        try {
            const gallery = new Gallery({
                ...data,
                uploadedBy: userId
            });
            await gallery.save();
            return gallery;
        } catch (error) {
            throw error;
        }
    }

    async getGalleryById(id) {
        try {
            const gallery = await Gallery.findById(id)
                .populate('uploadedBy', 'name email profilePicture')
                .populate('relatedEvent', 'title startDate')
                .populate('likes', 'name')
                .populate('comments.user', 'name profilePicture');

            if (!gallery) throw new Error('Gallery not found');
            return gallery;
        } catch (error) {
            throw error;
        }
    }

    async getAllGalleries(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};
            if (filters.status) query.status = filters.status;
            if (filters.albumType) query.albumType = filters.albumType;
            if (filters.visibility) query.visibility = filters.visibility;
            if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
            if (filters.uploadedBy) query.uploadedBy = filters.uploadedBy;
            if (filters.relatedEvent) query.relatedEvent = filters.relatedEvent;

            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(filters.search, 'i')] } }
                ];
            }

            const skip = (page - 1) * limit;
            const galleries = await Gallery.find(query)
                .populate('uploadedBy', 'name')
                .skip(skip)
                .limit(limit)
                .sort({ date: -1 });

            const total = await Gallery.countDocuments(query);
            return { galleries, pagination: { total, page, pages: Math.ceil(total / limit), limit } };
        } catch (error) {
            throw error;
        }
    }

    async updateGallery(id, data, userId) {
        try {
            // Check ownership is handled in controller or policy, here we just update
            const gallery = await Gallery.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true, runValidators: true }
            ).populate('uploadedBy', 'name');

            if (!gallery) throw new Error('Gallery not found');
            return gallery;
        } catch (error) {
            throw error;
        }
    }

    async deleteGallery(id, userId) {
        try {
            const gallery = await Gallery.findByIdAndDelete(id);
            if (!gallery) throw new Error('Gallery not found');
            return { message: 'Gallery deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async toggleLike(id, userId) {
        try {
            const gallery = await Gallery.findById(id);
            if (!gallery) throw new Error('Gallery not found');

            const index = gallery.likes.indexOf(userId);
            if (index === -1) {
                gallery.likes.push(userId);
            } else {
                gallery.likes.splice(index, 1);
            }

            await gallery.save();
            return gallery;
        } catch (error) {
            throw error;
        }
    }

    async addComment(id, userId, content) {
        try {
            const gallery = await Gallery.findById(id);
            if (!gallery) throw new Error('Gallery not found');

            gallery.comments.push({
                user: userId,
                content
            });

            await gallery.save();
            // Return the new comment with populated user
            const updatedGallery = await Gallery.findById(id)
                .populate('comments.user', 'name profilePicture');
            const newComment = updatedGallery.comments[updatedGallery.comments.length - 1];

            return newComment;
        } catch (error) {
            throw error;
        }
    }

    async deleteComment(galleryId, commentId, userId) {
        try {
            const gallery = await Gallery.findById(galleryId);
            if (!gallery) throw new Error('Gallery not found');

            const comment = gallery.comments.id(commentId);
            if (!comment) throw new Error('Comment not found');

            // Allow comment author or gallery owner to delete
            if (comment.user.toString() !== userId && gallery.uploadedBy.toString() !== userId) {
                throw new Error('Not authorized to delete this comment');
            }

            comment.remove();
            await gallery.save();
            return { message: 'Comment deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new GalleryService();
