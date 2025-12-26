/**
 * Direct Admin Setup - Works without .env file
 * 
 * This script connects directly to MongoDB and makes a user admin
 * 
 * Usage: node make-admin-direct.js <email> [mongodb-uri]
 */

const mongoose = require('mongoose');

// Get email from command line
const email = process.argv[2];
const mongoUri = process.argv[3] || 'mongodb://localhost:27017/anti-hiv-aids-clubs';

if (!email) {
    console.error('❌ Please provide an email address');
    console.log('\nUsage: node make-admin-direct.js <email> [mongodb-uri]');
    console.log('Example: node make-admin-direct.js admin@example.com');
    console.log('Example with custom URI: node make-admin-direct.js admin@example.com mongodb://localhost:27017/hiv-aids-club');
    process.exit(1);
}

async function makeAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        console.log(`   URI: ${mongoUri}`);
        
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Define minimal User schema
        const userSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.model('User', userSchema);

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`❌ User with email "${email}" not found\n`);
            console.log('💡 Available users:');
            const allUsers = await User.find({}, 'email username firstName lastName');
            if (allUsers.length === 0) {
                console.log('   No users found in database');
                console.log('   Please register a user first through the application');
            } else {
                allUsers.forEach(u => {
                    console.log(`   - ${u.email} (${u.firstName} ${u.lastName})`);
                });
            }
            process.exit(1);
        }

        // Update user to admin
        await User.updateOne(
            { email },
            { 
                $set: { 
                    roles: ['admin'],
                    isActive: true
                } 
            }
        );

        // Get updated user
        const updatedUser = await User.findOne({ email });

        console.log('✅ Admin user setup successful!\n');
        console.log('📋 User Details:');
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   Username: ${updatedUser.username}`);
        console.log(`   Name: ${updatedUser.firstName} ${updatedUser.lastName}`);
        console.log(`   Roles: ${updatedUser.roles.join(', ')}`);
        console.log(`   Active: ${updatedUser.isActive}`);
        console.log('\n🎉 You can now login as admin!');
        console.log('\n📝 Next steps:');
        console.log('   1. Logout from the application');
        console.log('   2. Login again with your credentials');
        console.log('   3. Navigate to /admin');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 MongoDB connection refused. Please check:');
            console.log('   1. Is MongoDB running?');
            console.log('   2. Is the connection URI correct?');
            console.log('   3. Try: mongosh ' + mongoUri);
        }
        
        process.exit(1);
    }
}

makeAdmin();
