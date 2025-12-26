/**
 * Quick Admin Setup Script
 * 
 * Creates a default admin user with preset credentials
 * 
 * Default Credentials:
 * Email: admin@huclub.com
 * Password: Admin123!
 * 
 * Usage:
 * node quick-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const quickAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const defaultAdmin = {
            email: 'admin@huclub.com',
            username: 'admin',
            password: 'Admin123!',
            firstName: 'Admin',
            lastName: 'User',
            roles: ['admin'],
            isActive: true,
            department: 'Administration',
            year: 1,
            membershipStatus: 'active',
            isEmailVerified: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            $or: [
                { email: defaultAdmin.email }, 
                { username: defaultAdmin.username }
            ] 
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('\n📋 Existing Admin:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Username: ${existingAdmin.username}`);
            console.log(`   Roles: ${existingAdmin.roles.join(', ')}`);
            
            // Update to admin if not already
            if (!existingAdmin.roles.includes('admin')) {
                existingAdmin.roles = ['admin'];
                existingAdmin.isActive = true;
                await existingAdmin.save();
                console.log('\n✅ Updated user to admin role!');
            }
            
            console.log('\n🎉 You can login at: http://localhost:5173/login');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Password: [your password]`);
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create(defaultAdmin);

        console.log('✅ Admin user created successfully!\n');
        console.log('📋 Login Credentials:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: ${defaultAdmin.password}`);
        console.log(`   Username: ${adminUser.username}`);
        console.log('\n🎉 Login at: http://localhost:5173/login');
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');

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

quickAdmin();
