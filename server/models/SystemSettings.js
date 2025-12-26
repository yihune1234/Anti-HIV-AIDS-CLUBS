const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'HIV/AIDS Peer Education Platform',
    trim: true
  },
  siteDescription: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  siteLogo: {
    type: String
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  features: {
    enableRegistration: {
      type: Boolean,
      default: true
    },
    enableStories: {
      type: Boolean,
      default: true
    },
    enableEvents: {
      type: Boolean,
      default: true
    },
    enableResources: {
      type: Boolean,
      default: true
    },
    enableGallery: {
      type: Boolean,
      default: true
    },
    enableAnonymousQuestions: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: false
    },
    requireContentApproval: {
      type: Boolean,
      default: true
    }
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    newUserNotification: {
      type: Boolean,
      default: true
    },
    newContentNotification: {
      type: Boolean,
      default: true
    },
    eventReminders: {
      type: Boolean,
      default: true
    }
  },
  security: {
    maxLoginAttempts: {
      type: Number,
      default: 5,
      min: 3,
      max: 10
    },
    sessionTimeout: {
      type: Number,
      default: 3600,
      min: 300
    },
    passwordMinLength: {
      type: Number,
      default: 6,
      min: 6,
      max: 20
    },
    requireStrongPassword: {
      type: Boolean,
      default: false
    }
  },
  content: {
    maxFileUploadSize: {
      type: Number,
      default: 5242880
    },
    allowedFileTypes: [{
      type: String
    }],
    defaultLanguage: {
      type: String,
      default: 'en'
    },
    supportedLanguages: [{
      type: String
    }]
  },
  maintenance: {
    isMaintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: {
      type: String
    }
  },
  analytics: {
    enableAnalytics: {
      type: Boolean,
      default: true
    },
    googleAnalyticsId: String
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
