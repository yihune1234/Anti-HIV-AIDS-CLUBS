/**
 * Create Yihune Admin User
 * Creates admin user with specific details
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createYihuneAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const adminData = {
            email: 'yihunebelay@gmail.com',
            username: 'yihune',
            password: 'yihune@123',
            firstName: 'Yihune',
            middleName: 'Belay',
            lastName: 'Sebsibe',
            studentId: '1063/15',
            department: 'Software Engineering',
            roles: ['admin'],
            isActive: true,
            year: 4,
            membershipStatus: 'active',
            isEmailVerified: true
        };

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: adminData.email }, 
                { username: adminData.username },
                { studentId: adminData.studentId }
            ] 
        });

        if (existingUser) {
            console.log('⚠️  User already exists!');
            console.log('\n📋 Existing User:');
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Username: ${existingUser.username}`);
            console.log(`   Student ID: ${existingUser.studentId}`);
            console.log(`   Roles: ${existingUser.roles.join(', ')}`);
            
            // Update to admin if not already
            if (!existingUser.roles.includes('admin')) {
                existingUser.roles = ['admin'];
                existingUser.isActive = true;
                existingUser.firstName = adminData.firstName;
                existingUser.middleName = adminData.middleName;
                existingUser.lastName = adminData.lastName;
                existingUser.department = adminData.department;
                existingUser.studentId = adminData.studentId;
                await existingUser.save();
                console.log('\n✅ Updated user to admin role with new details!');
            }
            
            console.log('\n🎉 You can login at: http://localhost:5173/login');
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Password: [your password]`);
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create(adminData);

        console.log('✅ Admin user created successfully!\n');
        console.log('📋 Login Credentials:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Student ID: ${adminUser.studentId}`);
        console.log(`   Name: ${adminUser.firstName} ${adminUser.middleName} ${adminUser.lastName}`);
        console.log(`   Department: ${adminUser.department}`);
        console.log(`   Roles: ${adminUser.roles.join(', ')}`);
        console.log('\n🎉 Login at: http://localhost:5173/login');
        console.log('\n⚠️  IMPORTANT: Keep these credentials secure!');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`   ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

createYihuneAdmin();
