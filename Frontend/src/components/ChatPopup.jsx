import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Minus, Send, Paperclip, Smile, MoreVertical, 
  Trash2, Archive, CheckCheck, User, Image as ImageIcon,
  File as FileIcon
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useDropzone } from 'react-dropzone';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';

const ChatPopup = () => {
  const { activeChat, closeChat, socket, sendMessage, isMessengerOpen } = useMessages();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile({
        file,
        name: file.name,
        type: file.type,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChat?.conversationId && activeChat.conversationId !== 'new') {
      fetchMessages();
      
      if (socket) {
        socket.emit('joinConversation', activeChat.conversationId);
      }
    } else {
      setMessages([]);
    }
  }, [activeChat, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg) => {
        if (msg.conversationId === activeChat?.conversationId) {
          setMessages(prev => [...prev, msg]);
        }
      };

      const handleTyping = ({ conversationId, userId }) => {
        if (conversationId === activeChat?.conversationId && userId !== user._id) {
          setRemoteTyping(true);
          setTimeout(() => setRemoteTyping(false), 3000);
        }
      };

      socket.on('newMessage', handleNewMessage);
      socket.on('userTyping', handleTyping);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('userTyping', handleTyping);
      };
    }
  }, [socket, activeChat, user]);

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages(activeChat.conversationId);
      setMessages(response.data.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !uploadedFile) return;

    let fileData = null;
    if (uploadedFile) {
      // In a real app, you would upload the file to S3/Cloudinary first
      // For this demo, we'll simulate the file data
      fileData = {
        fileUrl: uploadedFile.preview,
        fileName: uploadedFile.name,
        fileType: uploadedFile.type
      };
    }

    await sendMessage(inputText, fileData);
    setInputText('');
    setUploadedFile(null);
    setShowEmojiPicker(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (socket && activeChat?.conversationId !== 'new') {
      socket.emit('typing', {
        conversationId: activeChat.conversationId,
        receiverId: activeChat.receiver._id
      });
    }
  };

  const onEmojiClick = (emojiData) => {
    setInputText(prev => prev + emojiData.emoji);
  };

  if (!isMessengerOpen || !activeChat) return null;

  const styles = {
    popup: {
      position: 'fixed',
      bottom: '20px',
      right: '80px',
      width: '350px',
      height: isMinimized ? '50px' : '500px',
      backgroundColor: '#fff',
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      transition: 'height 0.3s ease',
    },
    header: {
      padding: '10px 15px',
      backgroundColor: 'var(--primary-blue)',
      color: '#fff',
      borderRadius: '12px 12px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
    },
    headerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      color: 'var(--primary-blue)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '0.9rem',
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      backgroundColor: '#f9f9f9',
    },
    msgRow: (isMe) => ({
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
    }),
    bubble: (isMe) => ({
      maxWidth: '80%',
      padding: '8px 12px',
      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      backgroundColor: isMe ? 'var(--primary-blue)' : '#e4e6eb',
      color: isMe ? '#fff' : '#050505',
      fontSize: '0.9rem',
      position: 'relative',
    }),
    inputArea: {
      padding: '10px',
      borderTop: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    input: {
      flex: 1,
      border: 'none',
      backgroundColor: '#f0f2f5',
      padding: '8px 12px',
      borderRadius: '20px',
      outline: 'none',
      fontSize: '0.9rem',
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#65676b',
      padding: '4px',
    },
    typing: {
      fontSize: '0.8rem',
      color: '#65676b',
      fontStyle: 'italic',
      padding: '0 15px 5px',
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={styles.popup}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div style={styles.header} onClick={() => setIsMinimized(!isMinimized)}>
        <div style={styles.headerInfo}>
          <div style={styles.avatar}>
            {activeChat.receiver.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{activeChat.receiver.name}</div>
            {!isMinimized && <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Active now</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ ...styles.iconBtn, color: '#fff' }} onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
            <Minus size={18} />
          </button>
          <button style={{ ...styles.iconBtn, color: '#fff' }} onClick={(e) => { e.stopPropagation(); closeChat(); }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div style={styles.messages}>
            {isDragActive && (
              <div style={{
                position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                border: '2px dashed var(--primary-blue)', borderRadius: '12px'
              }}>
                Drop files here
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMe = msg.sender === user._id;
              return (
                <div key={idx} style={styles.msgRow(isMe)}>
                  <div style={styles.bubble(isMe)}>
                    {msg.fileUrl && (
                      <div style={{ marginBottom: '8px' }}>
                        {msg.fileType?.startsWith('image/') ? (
                          <img src={msg.fileUrl} alt="uploaded" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isMe ? '#fff' : 'var(--primary-blue)', textDecoration: 'none' }}>
                            <FileIcon size={20} />
                            <span style={{ fontSize: '0.8rem' }}>{msg.fileName}</span>
                          </a>
                        )}
                      </div>
                    )}
                    {msg.text}
                    <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {uploadedFile && (
            <div style={{ padding: '10px', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {uploadedFile.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileIcon size={20} />}
              </div>
              <div style={{ flex: 1, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {uploadedFile.name}
              </div>
              <button style={styles.iconBtn} onClick={() => setUploadedFile(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          {remoteTyping && (
            <div style={styles.typing}>{activeChat.receiver.name} is typing...</div>
          )}

          <form style={styles.inputArea} onSubmit={handleSend}>
            <button type="button" style={styles.iconBtn}>
              <Paperclip size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <button type="button" style={styles.iconBtn} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile size={20} />
              </button>
              {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '40px', left: '0', zIndex: 1001 }}>
                  <EmojiPicker onEmojiClick={onEmojiClick} width={250} height={350} />
                </div>
              )}
            </div>
            <input 
              style={styles.input}
              placeholder="Aa"
              value={inputText}
              onChange={handleInputChange}
            />
            <button type="submit" style={{ ...styles.iconBtn, color: 'var(--primary-blue)' }}>
              <Send size={20} />
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default ChatPopup;
