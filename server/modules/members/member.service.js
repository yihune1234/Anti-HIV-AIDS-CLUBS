const Member = require('../../models/Member');

class MemberService {
    // Create new member
    async createMember(memberData) {
        try {
            const existingMember = await Member.findOne({
                $or: [{ user: memberData.user }, { studentId: memberData.studentId }]
            });

            if (existingMember) {
                if (existingMember.user.toString() === memberData.user) {
                    throw new Error('User is already a member');
                }
                if (existingMember.studentId === memberData.studentId) {
                    throw new Error('Student ID already exists');
                }
            }

            const member = new Member(memberData);
            await member.save();
            await member.populate('user', '-password');

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Get member by ID
    async getMemberById(memberId) {
        try {
            const member = await Member.findById(memberId)
                .populate('user', 'firstName lastName department year profileImage bio studentId')
                .populate('eventsAttended')
                .populate('sessionsAttended');

            if (!member) {
                throw new Error('Member not found');
            }

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Get member by user ID
    async getMemberByUserId(userId) {
        try {
            const member = await Member.findOne({ user: userId })
                .populate('user', 'firstName lastName department year profileImage bio studentId email phoneNumbers')
                .populate('eventsAttended')
                .populate('sessionsAttended');

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Get all members with filters
    async getAllMembers(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};

            if (filters.membershipStatus) {
                query.membershipStatus = filters.membershipStatus;
            }

            if (filters.department) {
                query.department = filters.department;
            }

            if (filters.yearOfStudy) {
                query.yearOfStudy = parseInt(filters.yearOfStudy);
            }

            if (filters.position) {
                query.position = filters.position;
            }

            if (filters.isActive !== undefined) {
                query.isActive = filters.isActive;
            }

            if (filters.search) {
                query.$or = [
                    { studentId: { $regex: filters.search, $options: 'i' } },
                    { department: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const skip = (page - 1) * limit;

            const members = await Member.find(query)
                .populate('user', 'firstName lastName department year profileImage bio studentId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Member.countDocuments(query);

            return {
                members,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Update member
    async updateMember(memberId, updateData) {
        try {
            const member = await Member.findByIdAndUpdate(
                memberId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate('user', '-password');

            if (!member) {
                throw new Error('Member not found');
            }

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Add event attendance
    async addEventAttendance(memberId, eventId) {
        try {
            const member = await Member.findById(memberId);

            if (!member) {
                throw new Error('Member not found');
            }

            if (member.eventsAttended.includes(eventId)) {
                throw new Error('Event already added to attendance');
            }

            member.eventsAttended.push(eventId);
            await member.save();
            await member.populate('eventsAttended');

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Remove event attendance
    async removeEventAttendance(memberId, eventId) {
        try {
            const member = await Member.findById(memberId);

            if (!member) {
                throw new Error('Member not found');
            }

            member.eventsAttended = member.eventsAttended.filter(
                (id) => id.toString() !== eventId
            );

            await member.save();
            await member.populate('eventsAttended');

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Add session attendance
    async addSessionAttendance(memberId, sessionId) {
        try {
            const member = await Member.findById(memberId);

            if (!member) {
                throw new Error('Member not found');
            }

            if (member.sessionsAttended.includes(sessionId)) {
                throw new Error('Session already added to attendance');
            }

            member.sessionsAttended.push(sessionId);
            await member.save();
            await member.populate('sessionsAttended');

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Update volunteer hours
    async updateVolunteerHours(memberId, hours) {
        try {
            const member = await Member.findById(memberId);

            if (!member) {
                throw new Error('Member not found');
            }

            member.volunteerHours += hours;
            await member.save();

            return member;
        } catch (error) {
            throw error;
        }
    }

    // Delete member
    async deleteMember(memberId) {
        try {
            const member = await Member.findByIdAndDelete(memberId);

            if (!member) {
                throw new Error('Member not found');
            }

            return { message: 'Member deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Get member statistics
    async getMemberStats() {
        try {
            const totalMembers = await Member.countDocuments();
            const activeMembers = await Member.countDocuments({ membershipStatus: 'active' });

            const membersByDepartment = await Member.aggregate([
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const membersByYear = await Member.aggregate([
                {
                    $group: {
                        _id: '$yearOfStudy',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            const membersByPosition = await Member.aggregate([
                {
                    $group: {
                        _id: '$position',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalVolunteerHours = await Member.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$volunteerHours' }
                    }
                }
            ]);

            return {
                totalMembers,
                activeMembers,
                membersByDepartment,
                membersByYear,
                membersByPosition,
                totalVolunteerHours: totalVolunteerHours[0]?.total || 0
            };
        } catch (error) {
            throw error;
        }
    }

    // Get top members by volunteer hours
    async getTopVolunteers(limit = 10) {
        try {
            const topVolunteers = await Member.find({ isActive: true })
                .populate('user', '-password')
                .sort({ volunteerHours: -1 })
                .limit(limit);

            return topVolunteers;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MemberService();
