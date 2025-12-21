const mongoose = require('mongoose');

const advisorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  staffId: {
    type: String,
    required: [true, 'Staff ID is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    enum: ['Dr.', 'Prof.', 'Mr.', 'Mrs.', 'Ms.', 'Mx.'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  faculty: {
    type: String,
    required: [true, 'Faculty is required'],
    trim: true
  },
  officeLocation: {
    type: String,
    trim: true
  },
  officeHours: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  qualifications: [{
    degree: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    year: {
      type: Number
    }
  }],
  advisorType: {
    type: String,
    enum: ['primary', 'secondary', 'technical', 'honorary'],
    default: 'primary'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  eventsSupervised: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  areasOfExpertise: [{
    type: String,
    trim: true
  }],
  researchInterests: [{
    type: String,
    trim: true
  }],
  publications: [{
    title: {
      type: String,
      trim: true
    },
    journal: {
      type: String,
      trim: true
    },
    year: {
      type: Number
    },
    url: {
      type: String,
      trim: true
    }
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
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
advisorSchema.index({ user: 1 });
advisorSchema.index({ staffId: 1 });
advisorSchema.index({ department: 1 });
advisorSchema.index({ advisorType: 1 });

// Virtual for total events supervised
advisorSchema.virtual('totalEventsSupervised').get(function () {
  return this.eventsSupervised ? this.eventsSupervised.length : 0;
});

// Virtual for years of service
advisorSchema.virtual('yearsOfService').get(function () {
  const endDate = this.endDate || new Date();
  const years = (endDate - this.startDate) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(years);
});

module.exports = mongoose.model('Advisor', advisorSchema);