const sessionService = require('./session.service');

class SessionController {
    // Create session (Admin only)
    async createSession(req, res) {
        try {
            const session = await sessionService.createSession(req.body);
            res.status(201).json({
                success: true,
                message: 'Peer education session created successfully',
                data: session
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all sessions (Members can view)
    async getAllSessions(req, res) {
        try {
            const { status, topic, educator, page = 1, limit = 10 } = req.query;
            const filters = {};
            if (status) filters.status = status;
            if (topic) filters.topic = topic;
            if (educator) filters.educator = educator;

            const result = await sessionService.getAllSessions(
                filters,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                data: result.sessions,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get session by ID
    async getSessionById(req, res) {
        try {
            const session = await sessionService.getSessionById(req.params.id);
            res.status(200).json({
                success: true,
                data: session
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update session (Admin only)
    async updateSession(req, res) {
        try {
            const session = await sessionService.updateSession(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Session updated successfully',
                data: session
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete session (Admin only)
    async deleteSession(req, res) {
        try {
            await sessionService.deleteSession(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Session deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Mark participation (Member action)
    async markParticipation(req, res) {
        try {
            const session = await sessionService.markParticipation(
                req.params.id,
                req.user._id
            );
            res.status(200).json({
                success: true,
                message: 'Participation marked successfully',
                data: session
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Mark attendance (Admin only)
    async markAttendance(req, res) {
        try {
            const { userId, attended } = req.body;
            const session = await sessionService.markAttendance(
                req.params.id,
                userId,
                attended
            );
            res.status(200).json({
                success: true,
                message: 'Attendance marked successfully',
                data: session
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get educator's sessions
    async getEducatorSessions(req, res) {
        try {
            const sessions = await sessionService.getEducatorSessions(req.params.educatorId);
            res.status(200).json({
                success: true,
                data: sessions
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get user's participation history
    async getUserParticipation(req, res) {
        try {
            const participation = await sessionService.getUserParticipation(req.user._id);
            res.status(200).json({
                success: true,
                data: participation
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get session statistics (Admin only)
    async getSessionStats(req, res) {
        try {
            const stats = await sessionService.getSessionStats();
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

    // Get session attendance report (Admin only)
    async getSessionAttendance(req, res) {
        try {
            const report = await sessionService.getSessionAttendance(req.params.id);
            res.status(200).json({
                success: true,
                data: report
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new SessionController();
