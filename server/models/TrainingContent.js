const mongoose = require('mongoose');

const trainingContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  contentType: {
    type: String,
    required: [true, 'Content type is required'],
    enum: ['video', 'slides', 'document', 'infographic', 'guideline', 'manual', 'article', 'other']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'HIV/AIDS Awareness',
      'Prevention Methods',
      'Sexual Health',
      'Mental Health',
      'Substance Abuse',
      'Gender-Based Violence',
      'Reproductive Health',
      'STI Prevention',
      'Life Skills',
      'Other'
    ]
  },
  accessLevel: {
    type: String,
    required: true,
    enum: ['public', 'members_only'],
    default: 'members_only'
  },
  fileUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  externalLink: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in minutes for videos
    min: 0
  },
  fileSize: {
    type: Number, // in bytes
    min: 0
  },
  downloadable: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true
  },
  publishedDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  completions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: {
      type: Number, // in minutes
      min: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      maxlength: 500
    }
  }],
  relatedSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PeerEducationSession'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
trainingContentSchema.index({ title: 'text', description: 'text', tags: 'text' });
trainingContentSchema.index({ category: 1 });
trainingContentSchema.index({ contentType: 1 });
trainingContentSchema.index({ accessLevel: 1 });
trainingContentSchema.index({ isActive: 1 });

// Virtual for completion count
trainingContentSchema.virtual('completionCount').get(function () {
  return this.completions ? this.completions.length : 0;
});

// Virtual for average rating
trainingContentSchema.virtual('averageRating').get(function () {
  if (!this.completions || this.completions.length === 0) return 0;
  const ratings = this.completions.filter(c => c.rating).map(c => c.rating);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return (sum / ratings.length).toFixed(1);
});

// Method to check if user completed this content
trainingContentSchema.methods.isCompletedBy = function(userId) {
  return this.completions.some(c => c.user.toString() === userId.toString());
};

// Method to mark as completed by user
trainingContentSchema.methods.markCompleted = function(userId, timeSpent, rating, feedback) {
  const existing = this.completions.find(c => c.user.toString() === userId.toString());
  if (existing) {
    existing.completedAt = new Date();
    if (timeSpent) existing.timeSpent = timeSpent;
    if (rating) existing.rating = rating;
    if (feedback) existing.feedback = feedback;
  } else {
    this.completions.push({
      user: userId,
      completedAt: new Date(),
      timeSpent,
      rating,
      feedback
    });
  }
  return this.save();
};

module.exports = mongoose.model('TrainingContent', trainingContentSchema);
