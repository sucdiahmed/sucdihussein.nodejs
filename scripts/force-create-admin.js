require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const forceCreateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Generate hashed password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Force insert admin user directly into MongoDB
        const result = await mongoose.connection.collection('users').updateOne(
            { email: 'admin@jobfinder.com' },
            {
                $set: {
                    username: 'Admin',
                    email: 'admin@jobfinder.com',
                    password: hashedPassword,
                    role: 'admin',
                    dateRegistered: new Date()
                }
            },
            { upsert: true } // This will create if doesn't exist or update if exists
        );

        console.log('Admin user force created:', result);
        
        // Verify the admin user
        const admin = await mongoose.connection.collection('users').findOne({ email: 'admin@jobfinder.com' });
        console.log('Admin user in database:', {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

forceCreateAdmin(); 