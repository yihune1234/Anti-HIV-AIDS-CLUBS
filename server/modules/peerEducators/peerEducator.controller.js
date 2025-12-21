const peerEducatorService = require('./peerEducator.service');

class PeerEducatorController {
    async createPeerEducator(req, res) {
        try {
            const peerEducator = await peerEducatorService.createPeerEducator(req.body);
            res.status(201).json({ success: true, message: 'Peer educator created successfully', data: peerEducator });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getPeerEducatorById(req, res) {
        try {
            const peerEducator = await peerEducatorService.getPeerEducatorById(req.params.id);
            res.status(200).json({ success: true, data: peerEducator });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async getAllPeerEducators(req, res) {
        try {
            const { status, specialization, page = 1, limit = 10 } = req.query;
            const filters = {};
            if (status) filters.status = status;
            if (specialization) filters.specialization = specialization;

            const result = await peerEducatorService.getAllPeerEducators(filters, parseInt(page), parseInt(limit));
            res.status(200).json({ success: true, data: result.peerEducators, pagination: result.pagination });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updatePeerEducator(req, res) {
        try {
            const peerEducator = await peerEducatorService.updatePeerEducator(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Peer educator updated successfully', data: peerEducator });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deletePeerEducator(req, res) {
        try {
            await peerEducatorService.deletePeerEducator(req.params.id);
            res.status(200).json({ success: true, message: 'Peer educator deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getPeerEducatorStats(req, res) {
        try {
            const stats = await peerEducatorService.getPeerEducatorStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new PeerEducatorController();
