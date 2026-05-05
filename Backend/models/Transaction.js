const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Digital Wallet'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    paymentDetails: {
      cardLast4: String,
      email: String,
      bankName: String,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
