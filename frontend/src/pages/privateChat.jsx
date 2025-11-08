// components/privateChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import ChatHeader from '../components/TherapistChat/ChatHeader'; // Ensure path is correct
import MessageList from '../components/TherapistChat/MessageList';
import MessageInput from '../components/TherapistChat/MessageInput';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';

const PrivateChat = ({ recipientId, onBack, onConversationUpdate }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);

  // Extract current user from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (e) {
        console.error('❌ Invalid token:', e);
        setError('Session invalid. Please log in again.');
      }
    } else {
      setError('Not authenticated');
    }
  }, []);

  // Initialize socket
  useEffect(() => {
    if (!currentUserId || !recipientId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    // Connect to /private-chat namespace
    const newSocket = io(`${API_URL}/private-chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      newSocket.emit('joinPrivateChat', { recipientId });
    });

    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('connect_error', () => setError('Connection failed. Retrying...'));
    newSocket.on('connect_timeout', () => setError('Connection timed out.'));

    // ✅ REAL-TIME CONVERSATION UPDATES
    newSocket.on('conversationUpdated', ({ last_message }) => {
      if (onConversationUpdate) {
        onConversationUpdate({
          other_user_id: recipientId,
          last_message: last_message
        });
      }
    });

    // Message events
    newSocket.on('privateMessageReceived', (message) => {
      setMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        return exists ? prev : [...prev, message];
      });
    });

    newSocket.on('privateMessageSent', (message) => {
      setMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        return exists ? prev : [...prev, message];
      });
    });

    newSocket.on('messageEdited', ({ messageId, newContent }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, is_edited: true, isEdited: true }
          : msg
      ));
    });

    newSocket.on('messageDeleted', ({ messageId }) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.emit('leavePrivateChat', { recipientId });
        newSocket.close();
      }
    };
  }, [currentUserId, recipientId, onConversationUpdate]);

  // Load message history
  useEffect(() => {
    if (!recipientId || !currentUserId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/private/history/${recipientId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const messageList = data.data || data.messages || [];
        setMessages(messageList);
      } catch (err) {
        console.error('❌ Failed to load messages:', err);
        // Optional: setError('Failed to load messages')
      }
    };

    loadMessages();
  }, [recipientId, currentUserId]);

  // Handlers
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;
    
    socket.emit('sendPrivateMessage', {
      recipientId,
      content: newMessage.trim()
    });
    
    socket.emit('stopTyping', { recipientId });
    setNewMessage('');
  };

  const handleTyping = () => {
    if (socket?.connected) {
      socket.emit('userTyping', { recipientId });
    }
  };

  const handleSendFile = (fileData) => {
    if (socket?.connected) {
      socket.emit('sendPrivateFile', { recipientId, ...fileData });
    }
  };

  // ✅ Let backend handle updates — no optimistic patching needed
  const handleDeleteMessage = (messageId) => {
    if (socket?.connected) {
      socket.emit('deleteMessage', { messageId });
    }
  };

  const handleEditMessage = (messageId, newContent) => {
    if (socket?.connected) {
      socket.emit('editMessage', { messageId, newContent });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#FCF0F8] to-[#F5E1F0] w-full max-w-full overflow-hidden">
      {/* Error banner */}
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 text-center font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <ChatHeader
        recipientId={recipientId}
        onBack={onBack}
        isConnected={isConnected}
        socket={socket}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-3 sm:px-4">
        <MessageList 
          messages={messages} 
          currentUserId={currentUserId}
          onDeleteMessage={handleDeleteMessage}
          onEditMessage={handleEditMessage}
        />
      </div>

      {/* Input */}
      <div className="px-2 pb-2 sm:px-4 sm:pb-4">
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          isConnected={isConnected}
          socket={socket}
          recipientId={recipientId}
          onSendFile={handleSendFile}
          onTyping={handleTyping}
        />
      </div>

      {/* Connection indicator */}
      {!isConnected && !error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></div>
            <span>Connecting…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChat;