import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { messageAPI } from '../services/api';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { conversationId, receiver }
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);

  // Initialize Socket
  useEffect(() => {
    if (token && user) {
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('newMessage', (message) => {
        // Update messages if this conversation is active
        // This will be handled by the chat component listening to the same socket or via context
        
        // Update conversation list last message
        setConversations(prev => {
          const index = prev.findIndex(c => c._id === message.conversationId);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              lastMessage: message,
              updatedAt: new Date().toISOString()
            };
            // Move to top
            const item = updated.splice(index, 1)[0];
            return [item, ...updated];
          }
          // If conversation not in list, fetch all again
          fetchConversations();
          return prev;
        });
      });

      newSocket.on('messageNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        // Update unread count in conversations
        setConversations(prev => prev.map(c => {
          if (c._id === notification.conversationId) {
            const currentCount = c.unreadCount?.[user._id] || 0;
            return {
              ...c,
              unreadCount: { ...c.unreadCount, [user._id]: currentCount + 1 }
            };
          }
          return c;
        }));
      });

      newSocket.on('userStatus', ({ userId, status }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (status === 'online') newSet.add(userId);
          else newSet.delete(userId);
          return newSet;
        });
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token, user]);

  const fetchConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const openChat = (receiver) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => 
      c.participants.some(p => p._id === receiver._id)
    );

    setActiveChat({
      conversationId: existingConv?._id || 'new',
      receiver
    });
    setIsMessengerOpen(true);
  };

  const closeChat = () => {
    setActiveChat(null);
    setIsMessengerOpen(false);
  };

  const sendMessage = async (text, fileData = null) => {
    if (!activeChat) return;

    try {
      const messageData = {
        receiverId: activeChat.receiver._id,
        text,
        ...fileData
      };

      if (activeChat.conversationId === 'new') {
        const response = await messageAPI.sendMessage(messageData);
        const newMsg = response.data.data;
        setActiveChat(prev => ({ ...prev, conversationId: newMsg.conversationId }));
        fetchConversations();
        return newMsg;
      } else {
        // Emit via socket for real-time
        socket.emit('sendMessage', {
          ...messageData,
          conversationId: activeChat.conversationId
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <MessageContext.Provider value={{
      conversations,
      activeChat,
      socket,
      notifications,
      onlineUsers,
      isMessengerOpen,
      openChat,
      closeChat,
      sendMessage,
      fetchConversations,
      setIsMessengerOpen
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
