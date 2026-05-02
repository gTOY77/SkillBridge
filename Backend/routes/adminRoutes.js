const express = require('express');
const router = express.Router();
const { getSystemStats, getRecentUsers, updateUserStatus } = require('../controllers/adminController');

// Import BOTH middlewares from your auth.js file
const { auth, adminOnly } = require('../middleware/auth');

// Apply both middlewares to protect the routes
// 'auth' runs first to verify the token. 'adminOnly' runs second to check the role.
router.get('/stats', auth, adminOnly, getSystemStats);
router.get('/users', auth, adminOnly, getRecentUsers);
router.put('/users/:id/status', auth, adminOnly, updateUserStatus);

module.exports = router;