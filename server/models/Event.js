const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: [
      'workshop',
      'seminar',
      'conference',
      'training',
      'awareness_campaign',
      'health_screening',
      'fundraising',
      'social',
      'meeting',
      'other'
    ]
  },
  category: {
    type: String,
    enum: [
      'HIV/AIDS Awareness',
      'Sexual Health',
      'Mental Health',
      'Substance Abuse Prevention',
      'Gender-Based Violence',
      'Reproductive Health',
      'General Health',
      'Community Outreach',
      'Capacity Building',
      'Other'
    ]
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  organizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  advisors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advisor'
  }],
  speakers: [{
    name: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    organization: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: [500, 'Speaker bio cannot exceed 500 characters']
    },
    photo: {
      type: String
    }
  }],
  targetAudience: {
    type: String,
    enum: ['students', 'staff', 'community', 'all'],
    default: 'all'
  },
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1']
  },
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registrationDate: {
      type: Date,
      default: Date.now
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
      }
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date
  },
  budget: {
    estimated: {
      type: Number,
      min: 0
    },
    actual: {
      type: Number,
      min: 0
    }
  },
  images: [{
    url: {
      type: String
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    }
  }],
  documents: [{
    title: {
      type: String,
      trim: true
    },
    url: {
      type: String
    },
    type: {
      type: String,
      enum: ['agenda', 'presentation', 'report', 'certificate', 'other']
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ isFeatured: 1 });

// Virtual for total registrations
eventSchema.virtual('totalRegistrations').get(function () {
  return this.registrations ? this.registrations.length : 0;
});

// Virtual for total attendees
eventSchema.virtual('totalAttendees').get(function () {
  return this.registrations ? this.registrations.filter(r => r.attended).length : 0;
});

// Virtual for available slots
eventSchema.virtual('availableSlots').get(function () {
  if (!this.capacity) return null;
  return this.capacity - this.totalRegistrations;
});

// Virtual for event duration in hours
eventSchema.virtual('durationHours').get(function () {
  if (!this.startDate || !this.endDate) return 0;
  return Math.abs(this.endDate - this.startDate) / 36e5;
});

// Validation: end date must be after start date
eventSchema.pre('validate', function (next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Event', eventSchema);