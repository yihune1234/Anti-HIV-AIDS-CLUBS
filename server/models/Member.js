const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  yearOfStudy: {
    type: Number,
    required: [true, 'Year of study is required'],
    min: [1, 'Year of study must be at least 1'],
    max: [7, 'Year of study cannot exceed 7']
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'graduated'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  position: {
    type: String,
    enum: ['member', 'coordinator', 'secretary', 'treasurer', 'president', 'vice_president'],
    default: 'member'
  },
  interests: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  eventsAttended: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  sessionsAttended: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PeerEducationSession'
  }],
  volunteerHours: {
    type: Number,
    default: 0,
    min: [0, 'Volunteer hours cannot be negative']
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    }
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
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
memberSchema.index({ user: 1 });
memberSchema.index({ studentId: 1 });
memberSchema.index({ membershipStatus: 1 });
memberSchema.index({ department: 1 });

// Virtual for total events attended
memberSchema.virtual('totalEventsAttended').get(function () {
  return this.eventsAttended ? this.eventsAttended.length : 0;
});

// Virtual for total sessions attended
memberSchema.virtual('totalSessionsAttended').get(function () {
  return this.sessionsAttended ? this.sessionsAttended.length : 0;
});

module.exports = mongoose.model('Member', memberSchema);