const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  roles: [{
    type: String,
    enum: ['superadmin', 'admin', 'member', 'advisor', 'peer_educator', 'moderator', 'content_manager'],
    default: ['member']
  }],
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    min: [1, 'Year must be at least 1'],
    max: [7, 'Year cannot exceed 7']
  },
  phoneNumbers: [{
    type: {
      type: String,
      enum: ['mobile', 'home', 'work', 'emergency'],
      default: 'mobile'
    },
    number: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  profileImage: {
    type: String,
    default: null
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
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
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  eventsAttended: [{
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    attended: {
      type: Boolean,
      default: false
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  }],
  sessionsAttended: [{
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PeerEducationSession'
    },
    attended: {
      type: Boolean,
      default: false
    }
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
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'graduated'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
userSchema.virtual('fullName').get(function () {
  if (this.middleName) {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('totalEventsAttended').get(function () {
  return this.eventsAttended ? this.eventsAttended.filter(e => e.attended).length : 0;
});

userSchema.virtual('totalSessionsAttended').get(function () {
  return this.sessionsAttended ? this.sessionsAttended.filter(s => s.attended).length : 0;
});

userSchema.virtual('primaryPhone').get(function () {
  if (!this.phoneNumbers || this.phoneNumbers.length === 0) return null;
  const primary = this.phoneNumbers.find(p => p.isPrimary);
  return primary ? primary.number : this.phoneNumbers[0].number;
});

// Pre-save hook for password hashing
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.createPasswordResetOTP = function () {
  // Generate random 6 digit number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.passwordResetToken = require('crypto').createHash('sha256').update(otp).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = require('crypto').randomBytes(32).toString('hex');
  this.emailVerificationToken = require('crypto').createHash('sha256').update(verificationToken).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return verificationToken;
};

module.exports = mongoose.model('User', userSchema);
