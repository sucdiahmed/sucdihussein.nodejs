const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contact - Send a contact message
router.post('/', contactController.sendMessage);

module.exports = router; 