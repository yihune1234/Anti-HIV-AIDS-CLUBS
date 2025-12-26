/**
 * Create Admin User Script
 * 
 * Creates a new admin user directly in the database
 * 
 * Usage:
 * node create-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get user details
        console.log('📝 Create Admin User\n');
        
        const email = await question('Email: ');
        const username = await question('Username: ');
        const password = await question('Password (min 6 chars): ');
        const firstName = await question('First Name: ');
        const lastName = await question('Last Name: ');

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            console.log('\n❌ User with this email or username already exists');
            console.log('\n💡 To make existing user admin, run:');
            console.log(`   node setup-admin.js ${email}`);
            rl.close();
            process.exit(1);
        }

        // Create admin user
        const adminUser = await User.create({
            email,
            username,
            password,
            firstName,
            lastName,
            roles: ['admin'],
            isActive: true,
            department: 'Administration',
            year: 1,
            membershipStatus: 'active',
            isEmailVerified: true
        });

        console.log('\n✅ Admin user created successfully!\n');
        console.log('📋 User Details:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
        console.log(`   Roles: ${adminUser.roles.join(', ')}`);
        console.log(`   Active: ${adminUser.isActive}`);
        console.log('\n🎉 You can now login at: http://localhost:5173/login');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: [the password you entered]`);

        rl.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`   ${key}: ${error.errors[key].message}`);
            });
        }
        rl.close();
        process.exit(1);
    }
};

createAdmin();
