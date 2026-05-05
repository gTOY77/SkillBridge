const express = require('express');
const router = express.Router();
const { createReport, getReports } = require('../controllers/reportController');

// Import your auth middleware (Make sure the path and name match your actual auth middleware!)
const { auth } = require('../middleware/auth'); // Sometimes this is named 'protect' instead of 'auth'

router.post('/', auth, createReport);
router.get('/', auth, getReports); 

module.exports = router;