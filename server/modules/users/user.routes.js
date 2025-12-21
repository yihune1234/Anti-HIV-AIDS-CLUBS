const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { validate } = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateRoleSchema
} = require('./user.validation');

// Public routes
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), userController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), userController.resetPassword);
router.get('/verify-email/:token', userController.verifyEmail);

// Protected routes (require authentication)
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

// Admin only routes
router.get('/stats', authorize('admin'), userController.getUserStats);
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', authorize('admin'), userController.getUserById);
router.put('/:id/role', authorize('admin'), validate(updateRoleSchema), userController.updateUserRole);
router.patch('/:id/toggle-status', authorize('admin'), userController.toggleUserStatus);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
