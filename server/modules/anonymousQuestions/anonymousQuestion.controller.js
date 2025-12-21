const anonymousQuestionService = require('./anonymousQuestion.service');

class AnonymousQuestionController {
  async createQuestion(req, res) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const sessionId = req.sessionID || req.headers['x-session-id'];
      const question = await anonymousQuestionService.createQuestion(req.body, ipAddress, sessionId);
      res.status(201).json({ success: true, message: 'Question submitted successfully', data: question });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getQuestionById(req, res) {
    try {
      const question = await anonymousQuestionService.getQuestionById(req.params.id);
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async getAllQuestions(req, res) {
    try {
      const { status, category, priority, isPublished, isFeatured, search, page = 1, limit = 10 } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (priority) filters.priority = priority;
      if (isPublished !== undefined) filters.isPublished = isPublished === 'true';
      if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
      if (search) filters.search = search;

      const result = await anonymousQuestionService.getAllQuestions(filters, parseInt(page), parseInt(limit));
      res.status(200).json({ success: true, data: result.questions, pagination: result.pagination });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async answerQuestion(req, res) {
    try {
      const question = await anonymousQuestionService.answerQuestion(req.params.id, req.body, req.user.id);
      res.status(200).json({ success: true, message: 'Question answered successfully', data: question });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateQuestion(req, res) {
    try {
      const question = await anonymousQuestionService.updateQuestion(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Question updated successfully', data: question });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteQuestion(req, res) {
    try {
      await anonymousQuestionService.deleteQuestion(req.params.id);
      res.status(200).json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async markHelpful(req, res) {
    try {
      const { isHelpful } = req.body;
      const question = await anonymousQuestionService.markHelpful(req.params.id, isHelpful);
      res.status(200).json({ success: true, message: 'Feedback recorded', data: question });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getQuestionStats(req, res) {
    try {
      const stats = await anonymousQuestionService.getQuestionStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AnonymousQuestionController();
