const express = require('express');
const router = express.Router();

// 1. Add 'resolveReport' to your imports from the controller
const { createReport, getReports, resolveReport } = require('../controllers/reportController');

// Import your auth middleware 
const { auth } = require('../middleware/auth'); 

router.post('/', auth, createReport);
router.get('/', auth, getReports); 

// 2. NEW: Add the PUT route for resolving reports, protected by auth
router.put('/:id/resolve', auth, resolveReport);

module.exports = router;