const express = require('express'); 
const router = express.Router(); 

const { 
  register, 
  login, 
  verifyLoginOTP, 
  getProfile, 
  logout 
} = require('../controllers/authController'); 

// 👇 THE FIX IS HERE: We added curly brackets around { auth } 👇
const { auth } = require('../middleware/auth'); 

// The Routes
router.post('/register', register); 
router.post('/login', login); 
router.post('/verify-login-otp', verifyLoginOTP); 

// These lines will now work perfectly because 'auth' is actually a function now!
router.post('/logout', auth, logout); 
router.get('/profile', auth, getProfile); 

module.exports = router;