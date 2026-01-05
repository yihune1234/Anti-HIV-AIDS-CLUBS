const mongoose = require('mongoose');
// Ensure models are registered for population
require('./Member');
require('./Advisor');
require('./User');

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
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  registrationOpenDate: {
    type: Date,
    required: [true, 'Registration open date is required']
  },
  registrationCloseDate: {
    type: Date,
    required: [true, 'Registration close date is required']
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
    isOnline: {
      type: Boolean,
      default: false
    },
    onlineLink: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  bannerImage: {
    url: {
      type: String,
      required: [true, 'Event banner image is required']
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    }
  },
  organizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  targetAudience: [{
    type: String,
    enum: ['students', 'staff', 'community', 'all', 'freshmen', 'sophomores', 'juniors', 'seniors']
  }],
  departments: [{
    type: String,
    trim: true
  }],
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1']
  },
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    },
    attendanceMarkedAt: {
      type: Date
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
      submittedAt: {
        type: Date
      }
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  registrationRequired: {
    type: Boolean,
    default: true
  },
  allowCancellation: {
    type: Boolean,
    default: true
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
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
eventSchema.index({ registrationOpenDate: 1, registrationCloseDate: 1 });

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

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function () {
  const now = new Date();
  const openDate = new Date(this.registrationOpenDate);
  const closeDate = new Date(this.registrationCloseDate);
  
  if (now < openDate) return 'not_open';
  if (now > closeDate) return 'closed';
  if (this.capacity && this.totalRegistrations >= this.capacity) return 'full';
  return 'open';
});

// Virtual for event timing status
eventSchema.virtual('eventStatus').get(function () {
  const now = new Date();
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  
  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'ongoing';
  return 'completed';
});

// Pre-save middleware to validate dates
eventSchema.pre('save', function(next) {
  // Validate end date is after start date
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  // Validate registration close date is after open date
  if (this.registrationCloseDate && this.registrationOpenDate && 
      this.registrationCloseDate < this.registrationOpenDate) {
    return next(new Error('Registration close date must be after open date'));
  }
  
  // Validate registration dates are before event start date
  if (this.registrationCloseDate && this.startDate && 
      this.registrationCloseDate > this.startDate) {
    return next(new Error('Registration must close before event starts'));
  }
  
  next();
});

// Method to check if user can register
eventSchema.methods.canUserRegister = function(userId) {
  const now = new Date();
  const openDate = new Date(this.registrationOpenDate);
  const closeDate = new Date(this.registrationCloseDate);
  
  // Check if registration is open
  if (now < openDate || now > closeDate) {
    return { canRegister: false, reason: 'Registration is not open' };
  }
  
  // Check capacity
  if (this.capacity && this.totalRegistrations >= this.capacity) {
    return { canRegister: false, reason: 'Event is full' };
  }
  
  // Check if already registered
  const isRegistered = this.registrations.some(r => 
    r.user && r.user.toString() === userId.toString()
  );
  if (isRegistered) {
    return { canRegister: false, reason: 'Already registered' };
  }
  
  return { canRegister: true };
};

// Method to check if user can cancel registration
eventSchema.methods.canUserCancelRegistration = function(userId) {
  if (!this.allowCancellation) {
    return { canCancel: false, reason: 'Cancellation not allowed for this event' };
  }
  
  const now = new Date();
  const closeDate = new Date(this.registrationCloseDate);
  
  // Allow cancellation until registration closes
  if (now > closeDate) {
    return { canCancel: false, reason: 'Registration period has ended' };
  }
  
  // Check if user is registered
  const registration = this.registrations.find(r => 
    r.user && r.user.toString() === userId.toString()
  );
  if (!registration) {
    return { canCancel: false, reason: 'Not registered for this event' };
  }
  
  return { canCancel: true };
};

module.exports = mongoose.model('Event', eventSchema);