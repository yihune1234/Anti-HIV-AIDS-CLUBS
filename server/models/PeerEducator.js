const mongoose = require('mongoose');

const peerEducatorSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Member reference is required']
  },
  certificationDate: {
    type: Date,
    required: [true, 'Certification date is required']
  },
  certificationNumber: {
    type: String,
    unique: true,
    trim: true
  },
  certificationExpiry: {
    type: Date
  },
  trainingCompleted: [{
    trainingName: {
      type: String,
      required: true,
      trim: true
    },
    trainingDate: {
      type: Date,
      required: true
    },
    trainingProvider: {
      type: String,
      trim: true
    },
    certificateUrl: {
      type: String,
      trim: true
    },
    hoursCompleted: {
      type: Number,
      min: 0
    }
  }],
  specializations: [{
    type: String,
    enum: [
      'HIV/AIDS Awareness',
      'Sexual Health',
      'Mental Health',
      'Substance Abuse',
      'Gender-Based Violence',
      'Reproductive Health',
      'STI Prevention',
      'Counseling',
      'First Aid',
      'Other'
    ]
  }],
  sessionsDelivered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PeerEducationSession'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'suspended'],
    default: 'active'
  },
  performanceRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: null
  },
  totalHoursDelivered: {
    type: Number,
    default: 0,
    min: [0, 'Hours cannot be negative']
  },
  studentsReached: {
    type: Number,
    default: 0,
    min: [0, 'Students reached cannot be negative']
  },
  mentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  availability: {
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false }
  },
  preferredTopics: [{
    type: String,
    trim: true
  }],
  languagesSpoken: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
peerEducatorSchema.index({ member: 1 });
peerEducatorSchema.index({ status: 1 });
peerEducatorSchema.index({ certificationNumber: 1 });

// Virtual for total sessions delivered
peerEducatorSchema.virtual('totalSessionsDelivered').get(function () {
  return this.sessionsDelivered ? this.sessionsDelivered.length : 0;
});

// Virtual for certification status
peerEducatorSchema.virtual('isCertificationValid').get(function () {
  if (!this.certificationExpiry) return true;
  return new Date() < this.certificationExpiry;
});

// Virtual for total mentees
peerEducatorSchema.virtual('totalMentees').get(function () {
  return this.mentees ? this.mentees.length : 0;
});

module.exports = mongoose.model('PeerEducator', peerEducatorSchema);
