require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const deleteAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteOne({ email: 'admin@jobfinder.com' });
        console.log('Admin user deleted if existed');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

deleteAdmin(); 