const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/process', auth, paymentController.processPayment);
router.get('/history', auth, paymentController.getTransactionHistory);
router.get('/earnings', auth, paymentController.getExpertEarnings);

module.exports = router;
