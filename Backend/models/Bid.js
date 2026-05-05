const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bidAmount: {
      type: Number,
      required: [true, 'Please provide bid amount'],
      min: 0,
    },
    proposedTimeline: {
      type: String,
      required: [true, 'Please provide proposed timeline'],
    },
    costBreakdown: {
      type: String,
      default: '',
    },
    relevantExperience: {
      type: String,
      default: '',
    },
    projectApproach: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'selected', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevent duplicate bids from the same expert on the same project
bidSchema.index({ projectId: 1, expertId: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
