const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    isArchived: {
      type: Map,
      of: Boolean,
      default: {},
    },
    isDeleted: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  { timestamps: true }
);

// Indexing for faster lookups
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
