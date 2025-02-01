const express = require('express');
const router = express.Router();
const {
    getStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllJobs,
    updateJobStatus,
    deleteJob
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// Stats route
router.get('/stats', getStats);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Job management routes
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

module.exports = router; 