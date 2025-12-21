const AnonymousQuestion = require('../../models/AnonymousQuestion');

class AnonymousQuestionService {
  async createQuestion(data, ipAddress, sessionId) {
    try {
      const question = new AnonymousQuestion({ ...data, ipAddress, sessionId });
      await question.save();
      return question;
    } catch (error) {
      throw error;
    }
  }

  async getQuestionById(id) {
    try {
      const question = await AnonymousQuestion.findById(id)
        .populate('answer.answeredBy', '-password')
        .populate('relatedQuestions');
      if (!question) throw new Error('Question not found');
      return question;
    } catch (error) {
      throw error;
    }
  }

  async getAllQuestions(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.category) query.category = filters.category;
      if (filters.priority) query.priority = filters.priority;
      if (filters.isPublished !== undefined) query.isPublished = filters.isPublished;
      if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
      if (filters.search) {
        query.$or = [
          { question: { $regex: filters.search, $options: 'i' } },
          { 'answer.content': { $regex: filters.search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      const questions = await AnonymousQuestion.find(query)
        .populate('answer.answeredBy', '-password')
        .skip(skip)
        .limit(limit)
        .sort({ submittedAt: -1 });

      const total = await AnonymousQuestion.countDocuments(query);
      return { questions, pagination: { total, page, pages: Math.ceil(total / limit), limit } };
    } catch (error) {
      throw error;
    }
  }

  async answerQuestion(id, answerData, userId) {
    try {
      const question = await AnonymousQuestion.findById(id);
      if (!question) throw new Error('Question not found');

      question.answer = {
        content: answerData.content,
        answeredBy: userId,
        answeredAt: new Date(),
        isVerified: answerData.isVerified || false
      };
      question.status = 'answered';

      await question.save();
      await question.populate('answer.answeredBy', '-password');
      return question;
    } catch (error) {
      throw error;
    }
  }

  async updateQuestion(id, data) {
    try {
      const question = await AnonymousQuestion.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
      if (!question) throw new Error('Question not found');
      return question;
    } catch (error) {
      throw error;
    }
  }

  async deleteQuestion(id) {
    try {
      const question = await AnonymousQuestion.findByIdAndDelete(id);
      if (!question) throw new Error('Question not found');
      return { message: 'Question deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async markHelpful(id, isHelpful) {
    try {
      const question = await AnonymousQuestion.findById(id);
      if (!question) throw new Error('Question not found');

      if (isHelpful) {
        question.helpful += 1;
      } else {
        question.notHelpful += 1;
      }

      await question.save();
      return question;
    } catch (error) {
      throw error;
    }
  }

  async getQuestionStats() {
    try {
      const total = await AnonymousQuestion.countDocuments();
      const pending = await AnonymousQuestion.countDocuments({ status: 'pending' });
      const answered = await AnonymousQuestion.countDocuments({ status: 'answered' });
      const byCategory = await AnonymousQuestion.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      return { total, pending, answered, byCategory };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AnonymousQuestionService();
