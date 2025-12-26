/**
 * List Users Script
 * Shows all users in the database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const listUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find all users
        const users = await User.find().select('email username firstName lastName roles isActive');

        if (users.length === 0) {
            console.log('\n❌ No users found in database');
            console.log('\n💡 Please register a user first through the application at:');
            console.log('   http://localhost:5173/register');
            process.exit(0);
        }

        console.log(`\n📋 Found ${users.length} user(s):\n`);
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email}`);
            console.log(`   Username: ${user.username}`);
            console.log(`   Name: ${user.firstName} ${user.lastName}`);
            console.log(`   Roles: ${user.roles.join(', ')}`);
            console.log(`   Active: ${user.isActive}`);
            console.log('');
        });

        console.log('💡 To make a user admin, run:');
        console.log('   node setup-admin.js <email>');
        console.log('\nExample:');
        console.log(`   node setup-admin.js ${users[0].email}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

listUsers();
