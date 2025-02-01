require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const deleteAllUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        console.log('All users deleted');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

deleteAllUsers(); 