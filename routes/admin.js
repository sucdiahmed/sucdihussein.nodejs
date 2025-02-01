const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', auth, adminController.getDashboardStats);

// Users management
router.get('/users/:id', auth, adminController.getUser);
router.patch('/users/:id', auth, adminController.updateUser);
router.delete('/users/:id', auth, adminController.deleteUser);

// Jobs management
router.get('/jobs/:id', auth, adminController.getJob);
router.patch('/jobs/:id', auth, adminController.updateJob);
router.delete('/jobs/:id', auth, adminController.deleteJob);

module.exports = router; 