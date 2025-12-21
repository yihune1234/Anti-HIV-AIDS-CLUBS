const mongoose = require('mongoose');

const anonymousQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'HIV/AIDS',
      'Sexual Health',
      'Mental Health',
      'Substance Abuse',
      'Relationships',
      'Prevention',
      'Treatment',
      'Testing',
      'Stigma',
      'Support',
      'General Health',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'answered', 'rejected', 'archived'],
    default: 'pending'
  },
  answer: {
    content: {
      type: String,
      maxlength: [3000, 'Answer cannot exceed 3000 characters']
    },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answeredAt: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    select: false
  },
  sessionId: {
    type: String,
    select: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },
  notHelpful: {
    type: Number,
    default: 0,
    min: [0, 'Not helpful count cannot be negative']
  },
  relatedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnonymousQuestion'
  }],
  moderatorNotes: {
    type: String,
    maxlength: [500, 'Moderator notes cannot exceed 500 characters'],
    select: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
anonymousQuestionSchema.index({ status: 1 });
anonymousQuestionSchema.index({ category: 1 });
anonymousQuestionSchema.index({ priority: 1 });
anonymousQuestionSchema.index({ isPublished: 1 });
anonymousQuestionSchema.index({ submittedAt: -1 });
anonymousQuestionSchema.index({ isFeatured: 1 });

// Virtual for helpfulness ratio
anonymousQuestionSchema.virtual('helpfulnessRatio').get(function () {
  const total = this.helpful + this.notHelpful;
  if (total === 0) return 0;
  return ((this.helpful / total) * 100).toFixed(1);
});

// Virtual for is answered
anonymousQuestionSchema.virtual('isAnswered').get(function () {
  return this.status === 'answered' && this.answer && this.answer.content;
});

// Virtual for days since submission
anonymousQuestionSchema.virtual('daysSinceSubmission').get(function () {
  const now = new Date();
  const diff = now - this.submittedAt;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('AnonymousQuestion', anonymousQuestionSchema);