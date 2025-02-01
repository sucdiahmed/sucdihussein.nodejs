const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// GET /api/jobs - Get all jobs
router.get('/', jobController.getAllJobs);

// GET /api/jobs/:id - Get job by ID
router.get('/:id', jobController.getJobById);

// POST /api/jobs - Create a new job (requires auth)
router.post('/', auth, async (req, res) => {
    try {
        await jobController.createJob(req, res);
    } catch (error) {
        console.error('Error in job creation route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 