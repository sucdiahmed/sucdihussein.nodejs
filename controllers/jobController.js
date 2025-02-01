const Job = require('../models/Job');
const { validateJob } = require('../utils/validation');

const jobController = {
    // Get all jobs
    async getAllJobs(req, res) {
        try {
            console.log('Fetching all jobs...');
            
            const jobs = await Job.find()
                .sort({ createdAt: -1 })
                .populate('postedBy', 'username email');

            console.log(`Found ${jobs.length} jobs`);

            // If no jobs found, return empty array instead of error
            res.json({
                success: true,
                jobs: jobs || []
            });
        } catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).json({ 
                message: 'Error fetching jobs',
                error: error.message 
            });
        }
    },

    // Create a new job
    async createJob(req, res) {
        try {
            console.log('Creating new job:', req.body);
            
            const job = new Job({
                ...req.body,
                postedBy: req.user._id
            });

            await job.save();
            console.log('Job created successfully:', job);

            res.status(201).json({
                success: true,
                message: 'Job created successfully',
                job
            });
        } catch (error) {
            console.error('Error creating job:', error);
            res.status(500).json({
                message: 'Failed to create job',
                error: error.message
            });
        }
    },

    // Get job by ID
    async getJobById(req, res) {
        try {
            const job = await Job.findById(req.params.id)
                .populate('postedBy', 'username email');

            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            res.json({
                success: true,
                job
            });
        } catch (error) {
            console.error('Error fetching job:', error);
            res.status(500).json({ 
                message: 'Error fetching job details',
                error: error.message 
            });
        }
    }
};

module.exports = jobController; 