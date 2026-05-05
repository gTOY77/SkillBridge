const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const crypto = require('crypto');

// @desc    Initiate and process a simulated payment
// @route   POST /api/payments/process
// @access  Private (Client only)
exports.processPayment = async (req, res) => {
  try {
    const { projectId, paymentMethod, cardDetails } = req.body;
    const clientId = req.userId;

    // 1. Validation
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.createdBy.toString() !== clientId) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay for this project' });
    }

    if (project.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Payment can only be made for completed projects' });
    }

    // Check if already paid
    const existingTransaction = await Transaction.findOne({ projectId, status: 'completed' });
    if (existingTransaction) {
      return res.status(400).json({ success: false, message: 'This project has already been paid for' });
    }

    // 2. Simulate Payment Logic
    // In a real system, this is where Stripe/PayPal API call happens
    const isSuccess = Math.random() > 0.05; // 95% success rate for simulation

    const transactionId = `TXN-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    
    const transactionData = {
      projectId,
      clientId,
      expertId: project.assignedTo,
      amount: project.budget,
      paymentMethod,
      transactionId,
      status: isSuccess ? 'completed' : 'failed',
      completedAt: isSuccess ? new Date() : null,
      paymentDetails: {
        cardLast4: cardDetails?.cardNumber ? cardDetails.cardNumber.slice(-4) : '****',
        email: cardDetails?.email || 'user@example.com'
      }
    };

    const transaction = await Transaction.create(transactionData);

    if (isSuccess) {
      // Create Notification for Expert
      await Notification.create({
        recipient: project.assignedTo,
        sender: clientId,
        type: 'payment_received',
        title: 'Payment Received!',
        content: `You have received a payment of $${project.budget} for the project: ${project.title}`,
        link: `/dashboard`,
        data: { 
          projectId: projectId.toString(), 
          transactionId,
          amount: project.budget.toString() 
        }
      });

      // Create Notification for Client (Confirmation)
      await Notification.create({
        recipient: clientId,
        sender: clientId, // Self-notification
        type: 'payment_completed',
        title: 'Payment Successful',
        content: `Your payment of $${project.budget} for "${project.title}" has been processed successfully.`,
        link: `/dashboard`,
        data: { 
          projectId: projectId.toString(), 
          transactionId,
          amount: project.budget.toString() 
        }
      });

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        transaction
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please check your simulated balance or try another method.',
        transaction
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing payment', error: error.message });
  }
};

// @desc    Get transaction history for the current user
// @route   GET /api/payments/history
// @access  Private
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.userRole;

    let query = {};
    if (role === 'expert') {
      query.expertId = userId;
    } else {
      query.clientId = userId;
    }

    const transactions = await Transaction.find(query)
      .populate('projectId', 'title')
      .populate('clientId', 'name email')
      .populate('expertId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });
  }
};

// @desc    Get total earnings for an expert
// @route   GET /api/payments/earnings
// @access  Private (Expert only)
exports.getExpertEarnings = async (req, res) => {
  try {
    const expertId = req.userId;

    const result = await Transaction.aggregate([
      { $match: { expertId: new mongoose.Types.ObjectId(expertId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: result[0]?.total || 0,
        count: result[0]?.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error calculating earnings', error: error.message });
  }
};
