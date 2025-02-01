const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyForJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('admin', 'job_poster'), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('admin', 'job_poster'), updateJob)
  .delete(protect, authorize('admin', 'job_poster'), deleteJob);

router.post('/:id/apply', protect, authorize('job_seeker'), applyForJob);

module.exports = router; 