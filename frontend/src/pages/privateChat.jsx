import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import ChatHeader from '../components/TherapistChat/ChatHeader';
import MessageList from '../components/TherapistChat/MessageList';
import MessageInput from '../components/TherapistChat/MessageInput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7777';

const PrivateChat = ({ recipientId, recipientName, onBack }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
        console.log('✅ Current user ID:', payload.id);
      } catch (e) {
        console.error('❌ Error parsing token:', e);
        setError('Invalid token');
      }
    } else {
      console.error('❌ No token found');
      setError('Not authenticated');
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId || !recipientId) {
      console.log('⏳ Waiting for user IDs...', { currentUserId, recipientId });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token');
      setError('Not authenticated');
      return;
    }

    console.log('🔌 Connecting to socket...');
    console.log('API URL:', API_URL);
    console.log('Namespace: /private');

    // Create socket connection to /private namespace
    const newSocket = io(`${API_URL}/private`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      setError(null);
      
      // Join private chat room
      newSocket.emit('joinPrivateChat', { recipientId });
      console.log('💬 Joined private chat with:', recipientId);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
      setError('Connection failed. Check if server is running.');
    });

    newSocket.on('connect_timeout', () => {
      console.error('❌ Connection timeout');
      setError('Connection timeout. Check server.');
    });

    // Message events
    newSocket.on('privateMessageReceived', (message) => {
      console.log('📨 Received message:', message);
      
      // Add message to list
      setMessages(prev => {
        // Avoid duplicates
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    newSocket.on('privateMessageSent', (message) => {
      console.log('✅ Message sent:', message);
      
      // Add message to list
      setMessages(prev => {
        // Avoid duplicates
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    // Message edited event
    newSocket.on('messageEdited', ({ messageId, newContent }) => {
      console.log('✏️ Message edited:', messageId);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, is_edited: true, isEdited: true }
          : msg
      ));
    });

    // Message deleted event
    newSocket.on('messageDeleted', ({ messageId }) => {
      console.log('🗑️ Message deleted:', messageId);
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    // Typing indicator
    newSocket.on('userTyping', ({ userId }) => {
      console.log('⌨️ User typing:', userId);
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      if (newSocket) {
        newSocket.emit('leavePrivateChat', { recipientId });
        newSocket.close();
      }
    };
  }, [currentUserId, recipientId]);

  // Load message history
  useEffect(() => {
    if (!recipientId || !currentUserId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        
        
        const response = await fetch(`${API_URL}/private/history/${recipientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📜 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          
          // Handle different response formats
          const messageList = data.messages || data.data || [];
          
          console.log('✅ Loaded messages:', messageList.length);
          setMessages(messageList);
        } else {
          console.warn('⚠️ Failed to load messages:', response.status);
          // Don't show error, just log it
        }
      } catch (error) {
        console.error('❌ Error loading messages:', error);
        // Don't show error, just log it
      }
    };

    loadMessages();
  }, [recipientId, currentUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) {
      console.warn('Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasSocket: !!socket, 
        isConnected 
      });
      return;
    }

    console.log('📤 Sending message to:', recipientId);
    
    // Send via socket
    socket.emit('sendPrivateMessage', {
      recipientId,
      content: newMessage.trim()
    });

    // Emit typing stopped
    socket.emit('stopTyping', { recipientId });

    setNewMessage('');
  };

  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit('userTyping', { recipientId });
    }
  };

  const handleSendFile = (fileData) => {
    if (!socket || !isConnected) {
      console.warn('Cannot send file: socket not connected');
      return;
    }

    console.log('📎 Sending file to:', recipientId);
    
    socket.emit('sendPrivateFile', {
      recipientId,
      ...fileData
    });
  };

  const handleDeleteMessage = (messageId) => {
    console.log('🗑️ Deleting message:', messageId);
    
    if (socket && isConnected) {
      socket.emit('deleteMessage', { messageId });
      
      // Optimistically remove from UI
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  const handleEditMessage = (messageId, newContent) => {
    console.log('✏️ Editing message:', messageId, newContent);
    
    if (socket && isConnected) {
      socket.emit('editMessage', { messageId, newContent });
      
      // Optimistically update UI
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, is_edited: true, isEdited: true }
          : msg
      ));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#FCF0F8] to-[#F5E1F0]">
      {/* Error banner */}
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 text-center font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <ChatHeader
        recipientName={recipientName}
        recipientId={recipientId}
        onBack={onBack}
        isConnected={isConnected}
        socket={socket}
      />

      {/* Messages */}
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
      />

      {/* Input */}
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

      {/* Connection status indicator */}
      {!isConnected && !error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-xl animate-pulse z-50">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <span className="font-semibold">Connecting to server...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChat;
