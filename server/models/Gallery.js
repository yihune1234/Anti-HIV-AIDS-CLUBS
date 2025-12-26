const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gallery title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    },
    altText: {
      type: String,
      maxlength: [100, 'Alt text cannot exceed 100 characters']
    },
    order: {
      type: Number,
      default: 0
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  albumType: {
    type: String,
    enum: ['event', 'activity', 'awareness_campaign', 'training', 'general', 'other'],
    default: 'general'
  },
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    venue: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'members_only', 'private'],
    default: 'public'
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: [300, 'Comment cannot exceed 300 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
gallerySchema.index({ status: 1 });
gallerySchema.index({ albumType: 1 });
gallerySchema.index({ date: -1 });
gallerySchema.index({ isFeatured: 1 });
gallerySchema.index({ visibility: 1 });

// Virtual for total images
gallerySchema.virtual('totalImages').get(function () {
  return this.images ? this.images.length : 0;
});

// Virtual for total likes
gallerySchema.virtual('totalLikes').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for total comments
gallerySchema.virtual('totalComments').get(function () {
  return this.comments ? this.comments.length : 0;
});

// Set cover image to first image if not set
gallerySchema.pre('save', function () {
  if (!this.coverImage && this.images && this.images.length > 0) {
    this.coverImage = this.images[0].url;
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
