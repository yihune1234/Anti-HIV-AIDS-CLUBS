const User = require('../models/User');
const Member = require('../models/Member');

class AccessControlMiddleware {
  // Check public user access
  static publicUserAccess(req, res, next) {
    // Public users can only access limited routes
    const publicRoutes = [
      '/api/anonymous-questions',
      '/api/public/awareness',
      '/api/public/about'
    ];

    if (publicRoutes.includes(req.path)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. Registration required.'
    });
  }

  // Check member access
  static async memberAccess(req, res, next) {
    try {
      // Verify user is logged in and is a member
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has member status
      const member = await Member.findOne({ userId: req.user._id });
      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'Member access required'
        });
      }

      // Attach member information to request
      req.member = member;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Access verification failed',
        error: error.message
      });
    }
  }

  // Implement granular access control
  static accessControl(model, action) {
    return async (req, res, next) => {
      try {
        // Define access matrix
        const accessMatrix = {
          'Event': {
            'view': this.canViewEvents,
            'participate': this.canParticipateInEvents
          },
          'Gallery': {
            'view': this.canViewGallery
          },
          'Resource': {
            'download': this.canDownloadResources
          }
        };

        // Check if model and action are supported
        if (!accessMatrix[model] || !accessMatrix[model][action]) {
          return res.status(403).json({
            success: false,
            message: 'Action not permitted'
          });
        }

        // Execute access check
        const canAccess = await accessMatrix[model][action](req.user, req.params);
        
        if (!canAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }

        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Access control error',
          error: error.message
        });
      }
    };
  }

  // Individual access check methods
  static async canViewEvents(user, params) {
    // Members can view events
    return !!user;
  }

  static async canParticipateInEvents(user, params) {
    // Check if user is a member and event is open
    const member = await Member.findOne({ userId: user._id });
    return !!member;
  }

  static async canViewGallery(user, params) {
    // Members can view gallery
    return !!user;
  }

  static async canDownloadResources(user, params) {
    // Members can download resources
    return !!user;
  }
}

module.exports = AccessControlMiddleware;