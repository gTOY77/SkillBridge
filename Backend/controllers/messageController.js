const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text, fileUrl, fileName, fileType, emoji } = req.body;
    const senderId = req.userId;

    // Check if expert is trying to initiate conversation
    const sender = await User.findById(senderId);
    if (sender.role === 'expert') {
      // Find if there's already a conversation
      const existingConv = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!existingConv) {
        return res.status(403).json({
          success: false,
          message: 'Experts cannot initiate conversations.'
        });
      }
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text,
      fileUrl,
      fileName,
      fileType,
      emoji
    });

    // Update conversation last message and reset unread count for receiver
    conversation.lastMessage = message._id;
    
    // Update unread count for receiver
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    
    // Reset flags if they were deleted/archived
    conversation.isDeleted.set(senderId.toString(), false);
    conversation.isDeleted.set(receiverId.toString(), false);
    conversation.isArchived.set(senderId.toString(), false);
    
    await conversation.save();

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// @desc    Get conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      participants: userId,
      [`isDeleted.${userId}`]: { $ne: true }
    })
      .populate('participants', 'name email profileImage role status')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversationId,
      [`isDeleted.${userId}`]: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Mark as read
    await Message.updateMany(
      { conversationId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    // Reset unread count for this user in the conversation
    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
      conversation.unreadCount.set(userId.toString(), 0);
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// @desc    Archive/Unarchive conversation
// @route   PUT /api/messages/conversation/:conversationId/archive
// @access  Private
exports.archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { archive } = req.body;
    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    conversation.isArchived.set(userId.toString(), archive);
    await conversation.save();

    res.status(200).json({ success: true, message: `Conversation ${archive ? 'archived' : 'unarchived'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating conversation', error: error.message });
  }
};

// @desc    Delete conversation
// @route   DELETE /api/messages/conversation/:conversationId
// @access  Private
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    conversation.isDeleted.set(userId.toString(), true);
    await conversation.save();

    // Mark all messages as deleted for this user
    await Message.updateMany(
      { conversationId },
      { $set: { [`isDeleted.${userId}`]: true } }
    );

    res.status(200).json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting conversation', error: error.message });
  }
};
