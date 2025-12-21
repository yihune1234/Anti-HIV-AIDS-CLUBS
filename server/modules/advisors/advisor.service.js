const Advisor = require('../../models/Advisor');

class AdvisorService {
    async createAdvisor(advisorData) {
        try {
            const existing = await Advisor.findOne({
                $or: [{ user: advisorData.user }, { staffId: advisorData.staffId }]
            });

            if (existing) {
                throw new Error(existing.user.toString() === advisorData.user ? 'User is already an advisor' : 'Staff ID already exists');
            }

            const advisor = new Advisor(advisorData);
            await advisor.save();
            await advisor.populate('user', '-password');
            return advisor;
        } catch (error) {
            throw error;
        }
    }

    async getAdvisorById(advisorId) {
        try {
            const advisor = await Advisor.findById(advisorId)
                .populate('user', '-password')
                .populate('eventsSupervised');
            if (!advisor) throw new Error('Advisor not found');
            return advisor;
        } catch (error) {
            throw error;
        }
    }

    async getAllAdvisors(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};
            if (filters.department) query.department = filters.department;
            if (filters.faculty) query.faculty = filters.faculty;
            if (filters.advisorType) query.advisorType = filters.advisorType;
            if (filters.isActive !== undefined) query.isActive = filters.isActive;
            if (filters.search) {
                query.$or = [
                    { staffId: { $regex: filters.search, $options: 'i' } },
                    { department: { $regex: filters.search, $options: 'i' } },
                    { faculty: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const skip = (page - 1) * limit;
            const advisors = await Advisor.find(query)
                .populate('user', '-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Advisor.countDocuments(query);

            return {
                advisors,
                pagination: { total, page, pages: Math.ceil(total / limit), limit }
            };
        } catch (error) {
            throw error;
        }
    }

    async updateAdvisor(advisorId, updateData) {
        try {
            const advisor = await Advisor.findByIdAndUpdate(
                advisorId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate('user', '-password');

            if (!advisor) throw new Error('Advisor not found');
            return advisor;
        } catch (error) {
            throw error;
        }
    }

    async deleteAdvisor(advisorId) {
        try {
            const advisor = await Advisor.findByIdAndDelete(advisorId);
            if (!advisor) throw new Error('Advisor not found');
            return { message: 'Advisor deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async getAdvisorStats() {
        try {
            const total = await Advisor.countDocuments();
            const active = await Advisor.countDocuments({ isActive: true });
            const byDepartment = await Advisor.aggregate([
                { $group: { _id: '$department', count: { $sum: 1 } } }
            ]);
            const byType = await Advisor.aggregate([
                { $group: { _id: '$advisorType', count: { $sum: 1 } } }
            ]);

            return { total, active, byDepartment, byType };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AdvisorService();
