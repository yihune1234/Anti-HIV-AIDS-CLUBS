const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  resourceType: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: [
      'document',
      'video',
      'image',
      'audio',
      'infographic',
      'presentation',
      'link',
      'book',
      'article',
      'toolkit',
      'guideline',
      'other'
    ]
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'HIV/AIDS Information',
      'Sexual Health',
      'Mental Health',
      'Substance Abuse',
      'Gender-Based Violence',
      'Reproductive Health',
      'Prevention',
      'Treatment',
      'Support Services',
      'Research',
      'Training Materials',
      'Other'
    ]
  },
  resourceUrl: {
    type: String,
    trim: true
  },
  externalUrl: {
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    trim: true
  },
  fileSize: {
    type: Number,
    min: 0
  },
  mimeType: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String
  },
  author: {
    name: {
      type: String,
      trim: true
    },
    organization: {
      type: String,
      trim: true
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  targetAudience: [{
    type: String,
    enum: ['students', 'educators', 'healthcare_workers', 'general_public', 'researchers', 'policymakers']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'approved', 'published', 'archived'],
    default: 'draft'
  },
  accessLevel: {
    type: String,
    enum: ['public', 'members_only', 'restricted'],
    default: 'public'
  },
  downloads: {
    type: Number,
    default: 0,
    min: [0, 'Downloads cannot be negative']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  relatedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  metadata: {
    isbn: String,
    doi: String,
    publisher: String,
    publicationYear: Number,
    edition: String,
    pageCount: Number,
    duration: Number // for videos/audio in minutes
  },
  // Training completion tracking
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
    feedback: {
      type: String,
      maxlength: 500
    }
  }],
  isTrainingMaterial: {
    type: Boolean,
    default: false
  },
  downloadable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
resourceSchema.index({ resourceType: 1 });
resourceSchema.index({ category: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ accessLevel: 1 });
resourceSchema.index({ isFeatured: 1 });
resourceSchema.index({ tags: 1 });

// Virtual for average rating
resourceSchema.virtual('averageRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

// Virtual for total ratings
resourceSchema.virtual('totalRatings').get(function () {
  return this.ratings ? this.ratings.length : 0;
});

// Virtual for file size in MB
resourceSchema.virtual('fileSizeMB').get(function () {
  if (!this.fileSize) return 0;
  return (this.fileSize / (1024 * 1024)).toFixed(2);
});

// Virtual for completion count
resourceSchema.virtual('completionCount').get(function () {
  return this.completions ? this.completions.length : 0;
});

// Method to check if user completed this resource
resourceSchema.methods.isCompletedBy = function(userId) {
  return this.completions.some(c => c.user.toString() === userId.toString());
};

// Method to mark as completed by user
resourceSchema.methods.markCompleted = function(userId, timeSpent, feedback) {
  const existing = this.completions.find(c => c.user.toString() === userId.toString());
  if (existing) {
    existing.completedAt = new Date();
    if (timeSpent) existing.timeSpent = timeSpent;
    if (feedback) existing.feedback = feedback;
  } else {
    this.completions.push({
      user: userId,
      completedAt: new Date(),
      timeSpent,
      feedback
    });
  }
  return this.save();
};

module.exports = mongoose.model('Resource', resourceSchema);