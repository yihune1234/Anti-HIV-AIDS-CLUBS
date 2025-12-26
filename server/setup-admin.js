/**
 * Setup Admin User Script
 * 
 * This script helps you create or update a user to have admin privileges.
 * 
 * Usage:
 * node setup-admin.js <email>
 * 
 * Example:
 * node setup-admin.js admin@example.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const setupAdmin = async (email) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiv-aids-club');
        console.log('✅ Connected to MongoDB');

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`❌ User with email "${email}" not found`);
            console.log('\n💡 Please register the user first through the application');
            process.exit(1);
        }

        // Update user roles to include admin
        user.roles = ['admin'];
        user.isActive = true;
        await user.save();

        console.log('\n✅ Admin user setup successful!');
        console.log('\n📋 User Details:');
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Roles: ${user.roles.join(', ')}`);
        console.log(`   Active: ${user.isActive}`);
        console.log('\n🎉 You can now login as admin!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
    console.error('❌ Please provide an email address');
    console.log('\nUsage: node setup-admin.js <email>');
    console.log('Example: node setup-admin.js admin@example.com');
    process.exit(1);
}

setupAdmin(email);
