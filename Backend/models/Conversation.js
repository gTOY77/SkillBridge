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

// Database-level validation: Prevent Expert-to-Expert conversations
conversationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    const participants = await User.find({ _id: { $in: this.participants } });
    
    const expertCount = participants.filter(p => p.role === 'expert').length;
    if (expertCount > 1) {
      return next(new Error('Permission denied: Experts cannot have conversations with other experts.'));
    }
  }
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);
