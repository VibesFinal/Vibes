// pages/PrivateChat.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import ChatHeader from '../components/ChatComponents/ChatHeader';
import MessageList from '../components/ChatComponents/MessageList';
import MessageInput from '../components/ChatComponents/MessageInput';
import DeleteConfirmationModal from '../components/ChatComponents/DeleteConfirmationModal';
import { showAlert, handleError } from '../utils/alertUtils';

// Use the same API_URL pattern as CommunityChat
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7777';

// Custom CSS with the color palette
const chatStyles = {
  container: {
    background: 'linear-gradient(135deg, #F0F0F0 0%, #DCC6A0 50%, #9FD6E2 100%)',
    minHeight: '100vh',
    padding: '20px'
  },
  chatWrapper: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(184, 233, 134, 0.3)',
    overflow: 'hidden',
    border: '1px solid rgba(184, 233, 134, 0.2)'
  },
  gradientBorder: {
    background: 'linear-gradient(90deg, #B8E986, #73C174, #9FD6E2, #DCC6A0)',
    height: '4px',
    width: '100%'
  }
};

const PrivateChat = ({ recipientId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [deleteConfirmMessageId, setDeleteConfirmMessageId] = useState(null);
  const [recipientName, setRecipientName] = useState('Therapist');
  const [isConnected, setIsConnected] = useState(false);

  const token = localStorage.getItem('token');

  const getCurrentUserId = () => {
    if (!token) return showAlert("You must be logged in to chat");
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return handleError(e);
    }
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!recipientId || !token) return;
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(`/api/users/${recipientId}`);
        setRecipientName(res.data.username || 'Therapist');
      } catch {
        setRecipientName('Therapist');
        handleError("Failed to fetch recipient info");
      }
    };
    fetch();
  }, [recipientId, token]);

  useEffect(() => {
    if (!token || !recipientId) return;

    // Connect to /private namespace with auth
    const newSocket = io(`${API_URL}/private`, { 
      auth: { token }, 
      transports: ['websocket', 'polling'], // Add polling as fallback
      reconnection: true,
      reconnectionAttempts: 5,
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to private chat namespace');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔴 Disconnected from private chat namespace');
    });

    const handleMessage = (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: payload.id,
          sender_id: payload.senderId,
          content: payload.content,
          created_at: payload.timestamp || new Date().toISOString(),
          is_deleted: false,
          is_edited: false,
          username: payload.username,
        },
      ]);
    };

    const handleEdit = ({ id, content, editedAt }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, content, edited_at: editedAt, is_edited: true } : msg
        )
      );
    };

    const handleDelete = ({ id }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, is_deleted: true, content: '' } : msg))
      );
    };

    newSocket.on('privateMessageReceived', handleMessage);
    newSocket.on('privateMessageSent', handleMessage);
    newSocket.on('privateMessageEdited', handleEdit);
    newSocket.on('privateMessageDeleted', handleDelete);
    newSocket.on('privateMessageError', (err) => {
      console.error('Chat error:', err);
      showAlert('Failed to send message: ' + err);
    });

    return () => {
      console.log('🧹 Cleaning up private chat socket');
      newSocket.close();
    };
  }, [recipientId, token]);

  useEffect(() => {
    if (!recipientId || !token) return;
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/private/history/${recipientId}`);
        setMessages(
          res.data.map((msg) => ({
            ...msg,
            is_deleted: msg.is_deleted || false,
            is_edited: !!msg.edited_at,
          }))
        );
      } catch (err) {
        console.error('Failed to load chat history:', err);
        handleError(err)
      }
    };
    fetchHistory();
  }, [recipientId, token]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    socket.emit('sendPrivateMessage', { recipientId, content: newMessage.trim() });
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = (msg) => {
    if (msg.sender_id !== currentUserId || msg.is_deleted) return;
    setEditingMessageId(msg.id);
    setEditContent(msg.content);
  };

  const handleSaveEdit = () => {
    if (!socket || !editContent.trim()) return;
    socket.emit('editPrivateMessage', { messageId: editingMessageId, newContent: editContent.trim() });
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleDeleteMessage = (messageId) => {
    setDeleteConfirmMessageId(messageId);
  };

  const confirmDelete = () => {
    if (socket && deleteConfirmMessageId) {
      socket.emit('deletePrivateMessage', { messageId: deleteConfirmMessageId });
    }
    setDeleteConfirmMessageId(null);
  };

  const cancelDelete = () => setDeleteConfirmMessageId(null);

  return (
    <div style={chatStyles.container} className="min-h-screen p-5">
      <div className="max-w-4xl mx-auto w-full h-full">
        <div style={chatStyles.chatWrapper} className="flex flex-col h-[90vh]">
          {/* Animated gradient border */}
          <div style={chatStyles.gradientBorder}></div>
          
          {/* Connection status indicator */}
          <div className={`px-4 py-1 text-xs font-medium text-center ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>

          <ChatHeader 
            recipientName={recipientName} 
            onBack={onBack}
            isConnected={isConnected}
          />
          
          <MessageList
            messages={messages}
            currentUserId={currentUserId}
            recipientName={recipientName}
            editingMessageId={editingMessageId}
            editContent={editContent}
            setEditContent={setEditContent}
            handleSaveEdit={handleSaveEdit}
            setEditingMessageId={setEditingMessageId}
            handleEditMessage={handleEditMessage}
            handleDeleteMessage={handleDeleteMessage}
          />
          
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            isConnected={isConnected}
          />
          
          <DeleteConfirmationModal
            isOpen={deleteConfirmMessageId !== null}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;