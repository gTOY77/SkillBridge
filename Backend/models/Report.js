const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please provide a description of the issue']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links the report to the logged-in User or Expert
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);