require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const listUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://yihunebelay859_db_user:ifEWnQrNSO82fsY9@cluster0.wrtnavf.mongodb.net/?appName=Cluster0';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const users = await User.find({}).select('email firstName roles isActive');
        console.log('\n--- ALL USERS ---');
        users.forEach(u => {
            console.log(`ID: ${u._id}`);
            console.log(`Email: ${u.email}`);
            console.log(`Name: ${u.firstName}`);
            console.log(`Roles: ${u.roles}`);
            console.log(`Active: ${u.isActive}`);
            console.log('-----------------');
        });
        console.log(`Total users: ${users.length}\n`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

listUsers();
