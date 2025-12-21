const mongoose = require('mongoose');

const peerEducationSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Session description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    enum: [
      'HIV/AIDS Awareness',
      'Sexual Health',
      'Mental Health',
      'Substance Abuse Prevention',
      'Gender-Based Violence',
      'Reproductive Health',
      'STI Prevention',
      'Healthy Relationships',
      'Consent Education',
      'Life Skills',
      'Stress Management',
      'Other'
    ]
  },
  sessionType: {
    type: String,
    required: [true, 'Session type is required'],
    enum: ['workshop', 'seminar', 'group_discussion', 'one_on_one', 'presentation', 'interactive', 'online', 'other']
  },
  educators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PeerEducator',
    required: true
  }],
  date: {
    type: Date,
    required: [true, 'Session date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  duration: {
    type: Number,
    min: [15, 'Duration must be at least 15 minutes']
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    room: {
      type: String,
      trim: true
    },
    building: {
      type: String,
      trim: true
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    onlineLink: {
      type: String,
      trim: true
    }
  },
  targetAudience: {
    type: String,
    enum: ['freshmen', 'sophomores', 'juniors', 'seniors', 'all_students', 'specific_department', 'mixed'],
    default: 'all_students'
  },
  department: {
    type: String,
    trim: true
  },
  expectedParticipants: {
    type: Number,
    min: [1, 'Expected participants must be at least 1']
  },
  actualParticipants: {
    type: Number,
    default: 0,
    min: [0, 'Actual participants cannot be negative']
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    attended: {
      type: Boolean,
      default: false
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: [500, 'Feedback comment cannot exceed 500 characters']
      },
      wouldRecommend: {
        type: Boolean
      }
    },
    preTestScore: {
      type: Number,
      min: 0,
      max: 100
    },
    postTestScore: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  materials: [{
    title: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['handout', 'presentation', 'video', 'worksheet', 'resource_link', 'other']
    },
    url: {
      type: String
    }
  }],
  objectives: [{
    type: String,
    trim: true
  }],
  methodologies: [{
    type: String,
    enum: ['lecture', 'discussion', 'role_play', 'case_study', 'demonstration', 'group_work', 'multimedia', 'games', 'other']
  }],
  status: {
    type: String,
    enum: ['planned', 'confirmed', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'planned'
  },
  completionReport: {
    summary: {
      type: String,
      maxlength: [1000, 'Summary cannot exceed 1000 characters']
    },
    challenges: {
      type: String,
      maxlength: [500, 'Challenges cannot exceed 500 characters']
    },
    successes: {
      type: String,
      maxlength: [500, 'Successes cannot exceed 500 characters']
    },
    recommendations: {
      type: String,
      maxlength: [500, 'Recommendations cannot exceed 500 characters']
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: {
      type: Date
    }
  },
  photos: [{
    url: {
      type: String
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    }
  }],
  requiresRegistration: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
peerEducationSessionSchema.index({ date: 1 });
peerEducationSessionSchema.index({ status: 1 });
peerEducationSessionSchema.index({ topic: 1 });
peerEducationSessionSchema.index({ educators: 1 });

// Virtual for total participants
peerEducationSessionSchema.virtual('totalParticipants').get(function () {
  return this.participants ? this.participants.length : 0;
});

// Virtual for attendance rate
peerEducationSessionSchema.virtual('attendanceRate').get(function () {
  if (!this.participants || this.participants.length === 0) return 0;
  const attended = this.participants.filter(p => p.attended).length;
  return ((attended / this.participants.length) * 100).toFixed(1);
});

// Virtual for average rating
peerEducationSessionSchema.virtual('averageRating').get(function () {
  if (!this.participants || this.participants.length === 0) return 0;
  const ratings = this.participants
    .filter(p => p.feedback && p.feedback.rating)
    .map(p => p.feedback.rating);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return (sum / ratings.length).toFixed(1);
});

// Virtual for knowledge gain
peerEducationSessionSchema.virtual('averageKnowledgeGain').get(function () {
  if (!this.participants || this.participants.length === 0) return 0;
  const gains = this.participants
    .filter(p => p.preTestScore !== undefined && p.postTestScore !== undefined)
    .map(p => p.postTestScore - p.preTestScore);
  if (gains.length === 0) return 0;
  const sum = gains.reduce((acc, g) => acc + g, 0);
  return (sum / gains.length).toFixed(1);
});

// Calculate duration from start and end time
peerEducationSessionSchema.pre('save', function (next) {
  if (this.startTime && this.endTime && !this.duration) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    this.duration = endMinutes - startMinutes;
  }
  next();
});

module.exports = mongoose.model('PeerEducationSession', peerEducationSessionSchema);
