require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const promoteUser = async () => {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email address as an argument.');
        process.exit(1);
    }

    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://yihunebelay859_db_user:ifEWnQrNSO82fsY9@cluster0.wrtnavf.mongodb.net/?appName=Cluster0';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        if (!user.roles.includes('admin')) {
            user.roles.push('admin');
            await user.save();
            console.log(`User ${email} promoted to admin.`);
        } else {
            console.log(`User ${email} is already an admin.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

promoteUser();
