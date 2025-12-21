const PeerEducator = require('../../models/PeerEducator');

class PeerEducatorService {
    async createPeerEducator(data) {
        try {
            const existing = await PeerEducator.findOne({ member: data.member });
            if (existing) throw new Error('Member is already a peer educator');

            const peerEducator = new PeerEducator(data);
            await peerEducator.save();
            await peerEducator.populate('member');
            return peerEducator;
        } catch (error) {
            throw error;
        }
    }

    async getPeerEducatorById(id) {
        try {
            const peerEducator = await PeerEducator.findById(id)
                .populate({ path: 'member', populate: { path: 'user', select: '-password' } })
                .populate('sessionsDelivered')
                .populate('mentees');
            if (!peerEducator) throw new Error('Peer educator not found');
            return peerEducator;
        } catch (error) {
            throw error;
        }
    }

    async getAllPeerEducators(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};
            if (filters.status) query.status = filters.status;
            if (filters.specialization) query.specializations = filters.specialization;

            const skip = (page - 1) * limit;
            const peerEducators = await PeerEducator.find(query)
                .populate({ path: 'member', populate: { path: 'user', select: '-password' } })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await PeerEducator.countDocuments(query);
            return { peerEducators, pagination: { total, page, pages: Math.ceil(total / limit), limit } };
        } catch (error) {
            throw error;
        }
    }

    async updatePeerEducator(id, data) {
        try {
            const peerEducator = await PeerEducator.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
                .populate({ path: 'member', populate: { path: 'user', select: '-password' } });
            if (!peerEducator) throw new Error('Peer educator not found');
            return peerEducator;
        } catch (error) {
            throw error;
        }
    }

    async deletePeerEducator(id) {
        try {
            const peerEducator = await PeerEducator.findByIdAndDelete(id);
            if (!peerEducator) throw new Error('Peer educator not found');
            return { message: 'Peer educator deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async getPeerEducatorStats() {
        try {
            const total = await PeerEducator.countDocuments();
            const active = await PeerEducator.countDocuments({ status: 'active' });
            const bySpecialization = await PeerEducator.aggregate([
                { $unwind: '$specializations' },
                { $group: { _id: '$specializations', count: { $sum: 1 } } }
            ]);

            return { total, active, bySpecialization };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PeerEducatorService();
