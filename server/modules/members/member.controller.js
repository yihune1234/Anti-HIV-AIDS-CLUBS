const memberService = require('./member.service');

class MemberController {
    // Create new member
    async createMember(req, res) {
        try {
            const member = await memberService.createMember(req.body);

            res.status(201).json({
                success: true,
                message: 'Member created successfully',
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get member by ID
    async getMemberById(req, res) {
        try {
            const member = await memberService.getMemberById(req.params.id);

            res.status(200).json({
                success: true,
                data: member
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get current user's member profile
    async getMyMemberProfile(req, res) {
        try {
            const member = await memberService.getMemberByUserId(req.user.id);

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Member profile not found'
                });
            }

            res.status(200).json({
                success: true,
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all members
    async getAllMembers(req, res) {
        try {
            const {
                membershipStatus,
                department,
                yearOfStudy,
                position,
                isActive,
                search,
                page = 1,
                limit = 10
            } = req.query;

            const filters = {};
            if (membershipStatus) filters.membershipStatus = membershipStatus;
            if (department) filters.department = department;
            if (yearOfStudy) filters.yearOfStudy = yearOfStudy;
            if (position) filters.position = position;
            if (isActive !== undefined) filters.isActive = isActive === 'true';
            if (search) filters.search = search;

            const result = await memberService.getAllMembers(
                filters,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                data: result.members,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update member
    async updateMember(req, res) {
        try {
            const member = await memberService.updateMember(req.params.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Member updated successfully',
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Add event attendance
    async addEventAttendance(req, res) {
        try {
            const { id } = req.params;
            const { eventId } = req.body;

            const member = await memberService.addEventAttendance(id, eventId);

            res.status(200).json({
                success: true,
                message: 'Event attendance added successfully',
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Remove event attendance
    async removeEventAttendance(req, res) {
        try {
            const { id, eventId } = req.params;

            const member = await memberService.removeEventAttendance(id, eventId);

            res.status(200).json({
                success: true,
                message: 'Event attendance removed successfully',
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Add session attendance
    async addSessionAttendance(req, res) {
        try {
            const { id } = req.params;
            const { sessionId } = req.body;

            const member = await memberService.addSessionAttendance(id, sessionId);

            res.status(200).json({
                success: true,
                message: 'Session attendance added successfully',
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update volunteer hours
    async updateVolunteerHours(req, res) {
        try {
            const { id } = req.params;
            const { hours } = req.body;

            const member = await memberService.updateVolunteerHours(id, hours);

            res.status(200).json({
                success: true,
                message: 'Volunteer hours updated successfully',
                data: member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete member
    async deleteMember(req, res) {
        try {
            await memberService.deleteMember(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Member deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get member statistics
    async getMemberStats(req, res) {
        try {
            const stats = await memberService.getMemberStats();

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

    // Get top volunteers
    async getTopVolunteers(req, res) {
        try {
            const { limit = 10 } = req.query;

            const topVolunteers = await memberService.getTopVolunteers(parseInt(limit));

            res.status(200).json({
                success: true,
                data: topVolunteers
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new MemberController();
