const Contact = require('../models/Contact');
const { validateContact } = require('../utils/validation');

const contactController = {
    // Send contact message
    async sendMessage(req, res) {
        try {
            console.log('Received contact form data:', req.body);

            // Validate request body
            const { error } = validateContact(req.body);
            if (error) {
                console.log('Validation error:', error.details[0].message);
                return res.status(400).json({ message: error.details[0].message });
            }

            const { name, email, subject, message } = req.body;

            // Create new contact message
            const contact = new Contact({
                name,
                email,
                subject,
                message
            });

            // Save to database
            const savedContact = await contact.save();
            console.log('Contact saved successfully:', savedContact);

            res.status(201).json({
                success: true,
                message: 'Message sent successfully'
            });

        } catch (error) {
            console.error('Error in sendMessage:', error);
            res.status(500).json({ 
                message: 'Internal server error',
                error: error.message 
            });
        }
    }
};

module.exports = contactController; 