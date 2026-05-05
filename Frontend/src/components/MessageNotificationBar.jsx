import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Bell, Search, MoreHorizontal, 
  Trash2, Archive, User, Circle
} from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';

const MessageNotificationBar = () => {
  const { conversations, openChat, onlineUsers, fetchConversations } = useMessages();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (conv.unreadCount?.[user?._id] || 0);
  }, 0);

  const styles = {
    wrapper: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 999,
    },
    toggle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#ff4d4f',
      color: '#fff',
      borderRadius: '10px',
      padding: '2px 6px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      border: '2px solid #fff',
    },
    panel: {
      position: 'absolute',
      bottom: '60px',
      right: '0',
      width: '320px',
      maxHeight: '450px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      padding: '15px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    list: {
      overflowY: 'auto',
      flex: 1,
    },
    item: (isUnread) => ({
      padding: '12px 15px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      backgroundColor: isUnread ? '#f0f7ff' : '#fff',
      transition: 'background-color 0.2s',
      borderBottom: '1px solid #f5f5f5',
    }),
    avatarWrapper: {
      position: 'relative',
    },
    avatar: {
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      backgroundColor: 'var(--bg-gray)',
      color: 'var(--primary-blue)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    statusIndicator: (isOnline) => ({
      position: 'absolute',
      bottom: '2px',
      right: '2px',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: isOnline ? '#52c41a' : '#bfbfbf',
      border: '2px solid #fff',
    }),
    content: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontWeight: '600',
      fontSize: '0.95rem',
      marginBottom: '2px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    preview: {
      fontSize: '0.85rem',
      color: '#65676b',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    time: {
      fontSize: '0.75rem',
      color: '#8e8e8e',
      fontWeight: 'normal',
    }
  };

  const handleItemClick = (conv) => {
    const otherParticipant = conv.participants.find(p => p._id !== user._id);
    openChat(otherParticipant);
    setIsOpen(false);
  };

  return (
    <div style={styles.wrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={styles.panel}
          >
            <div style={styles.header}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Messages</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Search size={18} style={{ cursor: 'pointer', color: '#65676b' }} />
                <MoreHorizontal size={18} style={{ cursor: 'pointer', color: '#65676b' }} />
              </div>
            </div>

            <div style={styles.list}>
              {conversations.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8e8e8e' }}>
                  <MessageSquare size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherParticipant = conv.participants.find(p => p._id !== user._id);
                  const isUnread = conv.unreadCount?.[user._id] > 0;
                  const isOnline = onlineUsers.has(otherParticipant._id);
                  
                  return (
                    <div 
                      key={conv._id} 
                      style={styles.item(isUnread)}
                      onClick={() => handleItemClick(conv)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isUnread ? '#f0f7ff' : '#fff'}
                    >
                      <div style={styles.avatarWrapper}>
                        <div style={styles.avatar}>
                          {otherParticipant.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.statusIndicator(isOnline)} />
                      </div>
                      <div style={styles.content}>
                        <div style={styles.name}>
                          {otherParticipant.name}
                          <span style={styles.time}>
                            {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div style={{ ...styles.preview, fontWeight: isUnread ? '600' : 'normal', color: isUnread ? '#000' : '#65676b' }}>
                          {conv.lastMessage?.text || 'No messages yet'}
                        </div>
                      </div>
                      {isUnread && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)' }} />
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            <div style={{ padding: '10px', borderTop: '1px solid #eee', textAlign: 'center' }}>
              <button 
                style={{ border: 'none', background: 'none', color: 'var(--primary-blue)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
        <MessageSquare size={24} />
        {unreadCount > 0 && <div style={styles.badge}>{unreadCount}</div>}
      </div>
    </div>
  );
};

export default MessageNotificationBar;
