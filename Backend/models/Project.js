const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide project description'],
    },
    category: {
      type: String,
      enum: ['Assignment Help', 'Peer Tutoring', 'Project Collaboration', 'Exam Prep', 'Other'],
      required: [true, 'Please select a category'],
    },
    skillsRequired: [
      {
        name: String,
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'expert'],
        },
      },
    ],
    budget: {
      type: Number,
      required: [true, 'Please provide budget'],
      min: 0,
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide deadline'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    description_detailed: {
      type: String,
      default: '',
    },
    attachments: [String],
    bids: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        bidAmount: Number,
        bidMessage: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
