const userService = require('./user.service');
const jwt = require('jsonwebtoken');

class UserController {
    // Register new user
    async register(req, res) {
        try {
            const user = await userService.createUser(req.body);

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, roles: user.roles },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '30s' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { user, token }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await userService.getUserByEmail(email);

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }

            // Update last login
            await userService.updateLastLogin(user._id);

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, roles: user.roles },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Remove password from response
            const userObject = user.toObject();
            delete userObject.password;

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: { user: userObject, token }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get current user profile
    async getProfile(req, res) {
        try {
            const user = await userService.getUserById(req.user.id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get user by ID
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all users
    async getAllUsers(req, res) {
        try {
            const { role, isActive, search, page = 1, limit = 10 } = req.query;

            const filters = {};
            if (role) filters.role = role;
            if (isActive !== undefined) filters.isActive = isActive === 'true';
            if (search) filters.search = search;

            const result = await userService.getAllUsers(
                filters,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update user profile
    async updateProfile(req, res) {
        try {
            const user = await userService.updateProfile(req.user.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Change password
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            await userService.changePassword(
                req.user.id,
                currentPassword,
                newPassword
            );

            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Forgot password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const resetToken = await userService.generatePasswordResetToken(email);

            // In production, send email with reset token
            // For now, return token in response (development only)
            res.status(200).json({
                success: true,
                message: 'Password reset token generated',
                resetToken // Remove this in production
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Reset password
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            await userService.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: 'Password reset successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Verify email
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;

            await userService.verifyEmail(token);

            res.status(200).json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update user role (admin only)
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await userService.updateUserRole(id, role);

            res.status(200).json({
                success: true,
                message: 'User role updated successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Toggle user status (admin only)
    async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;

            const user = await userService.toggleUserStatus(id);

            res.status(200).json({
                success: true,
                message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete user (admin only)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            await userService.deleteUser(id);

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get user statistics (admin only)
    async getUserStats(req, res) {
        try {
            const stats = await userService.getUserStats();

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
