const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide skill name'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['Programming', 'Design', 'Writing', 'Marketing', 'Business', 'Education', 'Other'],
      required: [true, 'Please select a category'],
    },
    description: {
      type: String,
      default: '',
    },
    professionalsCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
