const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        // Add detailed logging
        console.log('Full request body:', req.body);
        const { username, email, password, role } = req.body;
        console.log('Extracted values:', { username, email, role }); // Don't log password

        // Validate required fields
        if (!username || !email || !password || !role) {
            return res.status(400).json({ 
                message: 'Please provide all required fields including role' 
            });
        }

        // Validate role
        const validRoles = ['job_seeker', 'job_poster', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                message: 'Invalid role selected' 
            });
        }

        // Check if user exists
        let user = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (user) {
            return res.status(400).json({ 
                message: 'User with this email or username already exists' 
            });
        }

        // Create new user with single role
        user = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password,
            roles: [role]  // Set the single selected role
        });

        // Save user
        await user.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed',
            error: error.message 
        });
    }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 