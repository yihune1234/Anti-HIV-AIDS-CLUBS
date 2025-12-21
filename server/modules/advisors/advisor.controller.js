const advisorService = require('./advisor.service');

class AdvisorController {
    async createAdvisor(req, res) {
        try {
            const advisor = await advisorService.createAdvisor(req.body);
            res.status(201).json({ success: true, message: 'Advisor created successfully', data: advisor });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAdvisorById(req, res) {
        try {
            const advisor = await advisorService.getAdvisorById(req.params.id);
            res.status(200).json({ success: true, data: advisor });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async getAllAdvisors(req, res) {
        try {
            const { department, faculty, advisorType, isActive, search, page = 1, limit = 10 } = req.query;
            const filters = {};
            if (department) filters.department = department;
            if (faculty) filters.faculty = faculty;
            if (advisorType) filters.advisorType = advisorType;
            if (isActive !== undefined) filters.isActive = isActive === 'true';
            if (search) filters.search = search;

            const result = await advisorService.getAllAdvisors(filters, parseInt(page), parseInt(limit));
            res.status(200).json({ success: true, data: result.advisors, pagination: result.pagination });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateAdvisor(req, res) {
        try {
            const advisor = await advisorService.updateAdvisor(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Advisor updated successfully', data: advisor });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteAdvisor(req, res) {
        try {
            await advisorService.deleteAdvisor(req.params.id);
            res.status(200).json({ success: true, message: 'Advisor deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAdvisorStats(req, res) {
        try {
            const stats = await advisorService.getAdvisorStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AdvisorController();
