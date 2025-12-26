const PeerEducationSession = require('../../models/PeerEducationSession');
const User = require('../../models/User');

class PeerEducationSessionService {
    // Create a new session (Admin only)
    async createSession(sessionData) {
        const session = await PeerEducationSession.create(sessionData);
        return await session.populate('educators', 'firstName lastName email');
    }

    // Get all sessions (for members - only show upcoming and completed)
    async getAllSessions(filters = {}, page = 1, limit = 10) {
        const query = {};
        
        if (filters.status) query.status = filters.status;
        if (filters.topic) query.topic = filters.topic;
        if (filters.educator) query.educators = filters.educator;
        
        const skip = (page - 1) * limit;
        
        const [sessions, total] = await Promise.all([
            PeerEducationSession.find(query)
                .populate('educators', 'firstName lastName email profileImage')
                .populate('participants.user', 'firstName lastName email')
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            PeerEducationSession.countDocuments(query)
        ]);

        return {
            sessions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalDocs: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        };
    }

    // Get session by ID
    async getSessionById(sessionId) {
        const session = await PeerEducationSession.findById(sessionId)
            .populate('educators', 'firstName lastName email profileImage department')
            .populate('participants.user', 'firstName lastName email profileImage department');
        
        if (!session) {
            throw new Error('Session not found');
        }
        
        return session;
    }

    // Update session (Admin only)
    async updateSession(sessionId, updateData) {
        const session = await PeerEducationSession.findByIdAndUpdate(
            sessionId,
            updateData,
            { new: true, runValidators: true }
        ).populate('educators', 'firstName lastName email');
        
        if (!session) {
            throw new Error('Session not found');
        }
        
        return session;
    }

    // Delete session (Admin only)
    async deleteSession(sessionId) {
        const session = await PeerEducationSession.findByIdAndDelete(sessionId);
        
        if (!session) {
            throw new Error('Session not found');
        }
        
        return session;
    }

    // Mark participation (Member action)
    async markParticipation(sessionId, userId) {
        const session = await PeerEducationSession.findById(sessionId);
        
        if (!session) {
            throw new Error('Session not found');
        }

        // Check if user already participated
        const existingParticipation = session.participants.find(
            p => p.user.toString() === userId.toString()
        );

        if (existingParticipation) {
            throw new Error('You have already marked participation for this session');
        }

        // Add participation
        session.participants.push({
            user: userId,
            participationDate: new Date(),
            attended: true
        });

        session.actualParticipants = session.participants.length;
        await session.save();

        return await session.populate('participants.user', 'firstName lastName email');
    }

    // Mark attendance (Admin only - for marking who actually attended)
    async markAttendance(sessionId, userId, attended) {
        const session = await PeerEducationSession.findById(sessionId);
        
        if (!session) {
            throw new Error('Session not found');
        }

        const participant = session.participants.find(
            p => p.user.toString() === userId.toString()
        );

        if (!participant) {
            throw new Error('User is not registered for this session');
        }

        participant.attended = attended;
        await session.save();

        return session;
    }

    // Get sessions for a specific educator
    async getEducatorSessions(educatorId) {
        const sessions = await PeerEducationSession.find({
            educators: educatorId
        })
            .populate('educators', 'firstName lastName email')
            .populate('participants.user', 'firstName lastName')
            .sort({ date: -1 });

        return sessions;
    }

    // Get participation history for a user
    async getUserParticipation(userId) {
        const sessions = await PeerEducationSession.find({
            'participants.user': userId
        })
            .populate('educators', 'firstName lastName')
            .sort({ date: -1 });

        return sessions.map(session => ({
            session: {
                _id: session._id,
                title: session.title,
                topic: session.topic,
                date: session.date,
                status: session.status
            },
            participation: session.participants.find(
                p => p.user.toString() === userId.toString()
            )
        }));
    }

    // Get session statistics
    async getSessionStats() {
        const [
            totalSessions,
            upcomingSessions,
            completedSessions,
            totalParticipants
        ] = await Promise.all([
            PeerEducationSession.countDocuments(),
            PeerEducationSession.countDocuments({ status: 'upcoming' }),
            PeerEducationSession.countDocuments({ status: 'completed' }),
            PeerEducationSession.aggregate([
                { $unwind: '$participants' },
                { $group: { _id: null, total: { $sum: 1 } } }
            ])
        ]);

        return {
            totalSessions,
            upcomingSessions,
            completedSessions,
            totalParticipants: totalParticipants[0]?.total || 0
        };
    }

    // Get attendance report for a session
    async getSessionAttendance(sessionId) {
        const session = await PeerEducationSession.findById(sessionId)
            .populate('participants.user', 'firstName lastName email department studentId');

        if (!session) {
            throw new Error('Session not found');
        }

        return {
            session: {
                title: session.title,
                date: session.date,
                status: session.status
            },
            participants: session.participants,
            summary: {
                total: session.participants.length,
                attended: session.participants.filter(p => p.attended).length,
                attendanceRate: session.attendanceRate
            }
        };
    }
}

module.exports = new PeerEducationSessionService();
