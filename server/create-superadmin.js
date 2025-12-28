/**
 * Create Super Admin User Script
 * Use this to initialize a superadmin account in the database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createSuperAdmin = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const superAdminData = {
            email: 'yihune@gmail.com',
            username: 'yihune',
            password: 'yihune@123',
            firstName: 'Yihune',
            middleName: 'Belay',
            lastName: 'Sebsibe',
            studentId: '1063/15',
            department: 'Software Engineering',
            roles: ['superadmin'],
            isActive: true,
            year: 4,
            membershipStatus: 'active',
            isEmailVerified: true
        };

        // Check if user already exists by email, username, or studentId
        const existingUser = await User.findOne({
            $or: [
                { email: superAdminData.email },
                { username: superAdminData.username },
                { studentId: superAdminData.studentId }
            ]
        });

        if (existingUser) {
            console.log('\n⚠️  User already exists with one of these identifiers (Email, Username, or Student ID).');
            console.log(`📋 Current Details:`);
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Username: ${existingUser.username}`);
            console.log(`   Roles: ${existingUser.roles.join(', ')}`);

            console.log('\n⏳ Promoting to Super Admin and updating details...');

            existingUser.roles = ['superadmin'];
            existingUser.isActive = true;
            existingUser.firstName = superAdminData.firstName;
            existingUser.middleName = superAdminData.middleName;
            existingUser.lastName = superAdminData.lastName;
            existingUser.email = superAdminData.email;
            existingUser.username = superAdminData.username;
            existingUser.studentId = superAdminData.studentId;

            // Re-hash password if needed, but User model has a pre-save hook for this
            existingUser.password = superAdminData.password;

            await existingUser.save();
            console.log('✅ User successfully promoted to Super Admin!');
        } else {
            console.log('\n⏳ Creating new Super Admin account...');
            const newSuperAdmin = await User.create(superAdminData);
            console.log('✅ Super Admin account created successfully!');
        }

        console.log('\n🚀 Success! You can now login with:');
        console.log(`   Email: ${superAdminData.email}`);
        console.log(`   Password: ${superAdminData.password}`);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
};

createSuperAdmin();
