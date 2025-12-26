const User = require('../../models/User');
const crypto = require('crypto');

class UserService {
    // Create new user
    async createUser(userData) {
        try {
            const existingUser = await User.findOne({
                $or: [{ email: userData.email }, { username: userData.username }]
            });

            if (existingUser) {
                if (existingUser.email === userData.email) {
                    throw new Error('Email already exists');
                }
                if (existingUser.username === userData.username) {
                    throw new Error('Username already exists');
                }
            }

            const user = new User(userData);
            await user.save();

            // Remove password from response
            const userObject = user.toObject();
            delete userObject.password;

            return userObject;
        } catch (error) {
            throw error;
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email }).select('+password');
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Get all users with filters
    async getAllUsers(filters = {}, page = 1, limit = 10) {
        try {
            const query = {};

            if (filters.role) {
                query.roles = filters.role;
            }

            if (filters.isActive !== undefined) {
                query.isActive = filters.isActive;
            }

            if (filters.search) {
                query.$or = [
                    { username: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } },
                    { firstName: { $regex: filters.search, $options: 'i' } },
                    { lastName: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const skip = (page - 1) * limit;

            const users = await User.find(query)
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await User.countDocuments(query);

            return {
                users,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Change password
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findById(userId).select('+password');

            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

            user.password = newPassword;
            await user.save();

            return { message: 'Password changed successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Generate password reset token
    async generatePasswordResetToken(email) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('User not found');
            }

            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });

            return resetToken;
        } catch (error) {
            throw error;
        }
    }

    // Reset password
    async resetPassword(token, newPassword) {
        try {
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() }
            });

            if (!user) {
                throw new Error('Invalid or expired reset token');
            }

            user.password = newPassword;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            return { message: 'Password reset successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Verify email
    async verifyEmail(token) {
        try {
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await User.findOne({
                emailVerificationToken: hashedToken,
                emailVerificationExpires: { $gt: Date.now() }
            });

            if (!user) {
                throw new Error('Invalid or expired verification token');
            }

            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            return { message: 'Email verified successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Update user role (admin only)
    async updateUserRole(userId, role) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { roles: Array.isArray(role) ? role : [role] },
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Toggle user active status
    async toggleUserStatus(userId) {
        try {
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            user.isActive = !user.isActive;
            await user.save();

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    async deleteUser(userId) {
        try {
            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                throw new Error('User not found');
            }

            return { message: 'User deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Update last login
    async updateLastLogin(userId) {
        try {
            await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
        } catch (error) {
            throw error;
        }
    }

    // Get user statistics
    async getUserStats() {
        try {
            const totalUsers = await User.countDocuments();
            const activeUsers = await User.countDocuments({ isActive: true });
            const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

            const usersByRole = await User.aggregate([
                { $unwind: '$roles' },
                {
                    $group: {
                        _id: '$roles',
                        count: { $sum: 1 }
                    }
                }
            ]);

            return {
                totalUsers,
                activeUsers,
                verifiedUsers,
                usersByRole
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
