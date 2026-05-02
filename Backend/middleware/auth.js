const jwt = require('jsonwebtoken');

// 1. Your existing auth middleware (The First Bouncer)
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_change_this');
    req.userId = decoded.id;
    req.userRole = decoded.role; // <-- This is great! We will use this below.
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid.',
      error: error.message,
    });
  }
};

// 2. NEW: The adminOnly middleware (The VIP Bouncer)
const adminOnly = (req, res, next) => {
  // Since your auth middleware runs first, req.userRole is already set
  if (req.userRole === 'admin') {
    next(); // They are an admin, let them proceed!
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

// Export BOTH functions so you can use them in your routes
module.exports = { auth, adminOnly };