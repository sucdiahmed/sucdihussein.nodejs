const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/resumes');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('resume');

const applicationController = {
    async submitApplication(req, res) {
        try {
            upload(req, res, async function(err) {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                if (!req.file) {
                    return res.status(400).json({ message: 'Resume file is required' });
                }

                const { jobId, skills, coverLetter } = req.body;

                // Create new application
                const application = new Application({
                    jobId,
                    applicant: req.user._id,
                    skills,
                    coverLetter,
                    resume: req.file.path
                });

                // Save application
                await application.save();

                res.status(201).json({
                    success: true,
                    message: 'Application submitted successfully',
                    application
                });
            });
        } catch (error) {
            console.error('Error in submitApplication:', error);
            res.status(500).json({ 
                message: 'Failed to submit application',
                error: error.message 
            });
        }
    }
};

module.exports = applicationController; 