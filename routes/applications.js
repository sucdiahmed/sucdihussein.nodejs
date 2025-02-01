const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// POST /api/applications - Submit a job application
router.post('/', auth, applicationController.submitApplication);

module.exports = router; 