require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}).select('-password');
        console.log('All users in database:');
        users.forEach(user => {
            console.log({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

listUsers(); 