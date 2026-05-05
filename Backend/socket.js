const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

const setupSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_change_this');
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    onlineUsers.set(socket.userId, socket.id);

    // Broadcast online status
    io.emit('userStatus', { userId: socket.userId, status: 'online' });

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined room: ${conversationId}`);
      
      // Update unread count for the user joining
      Conversation.findById(conversationId).then(conv => {
        if (conv) {
          conv.unreadCount.set(socket.userId.toString(), 0);
          conv.save();
        }
      });
    });

    socket.on('sendMessage', async (data) => {
      const { conversationId, receiverId, text, fileUrl, fileName, fileType, emoji } = data;
      
      try {
        // Find or create conversation
        let conversation = await Conversation.findById(conversationId);
        if (!conversation) {
           conversation = await Conversation.findOne({
            participants: { $all: [socket.userId, receiverId] }
          });
        }

        const message = await Message.create({
          conversationId: conversation._id,
          sender: socket.userId,
          receiver: receiverId,
          text,
          fileUrl,
          fileName,
          fileType,
          emoji
        });

        conversation.lastMessage = message._id;
        const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
        conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
        await conversation.save();

        // Emit to the conversation room
        io.to(conversation._id.toString()).emit('newMessage', message);

        // Emit notification to receiver if they are online but not in the room
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('messageNotification', {
            conversationId: conversation._id,
            senderId: socket.userId,
            text: text || 'Sent a file'
          });
        }
      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    socket.on('typing', (data) => {
      const { conversationId, receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', { conversationId, userId: socket.userId });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId);
      io.emit('userStatus', { userId: socket.userId, status: 'offline' });
    });
  });

  return io;
};

module.exports = setupSocket;
