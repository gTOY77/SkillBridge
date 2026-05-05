const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  expert: { // The user receiving the review (Expert)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: { // The user writing the review (Verified Buyer/Client)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum 1 star
    max: 5  // Maximum 5 stars
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);