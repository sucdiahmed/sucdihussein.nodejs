require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@jobfinder.com' });
        if (admin) {
            console.log('Admin found:', {
                username: admin.username,
                email: admin.email,
                role: admin.role,
                id: admin._id
            });
        } else {
            console.log('No admin user found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkAdmin(); 