require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Force delete any existing admin
        await User.deleteOne({ email: 'admin@jobfinder.com' });
        console.log('Cleaned up any existing admin');

        // Create new admin user
        const admin = await User.create({
            username: 'Admin',
            email: 'admin@jobfinder.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin user created successfully:', {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role
        });

        // Verify the admin was created with correct role
        const verifyAdmin = await User.findOne({ email: 'admin@jobfinder.com' });
        console.log('Verification - Admin in database:', {
            id: verifyAdmin._id,
            username: verifyAdmin.username,
            email: verifyAdmin.email,
            role: verifyAdmin.role
        });

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin(); 