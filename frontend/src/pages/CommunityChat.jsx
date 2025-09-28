import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import MessageList from '../components/chat/MessageList';
import TypingIndicator from '../components/chat/TypingIndicator';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7777';
const SOCKET_SERVER_URL = API_URL;

const CommunityChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const typingTimeoutRef = useRef(null);

  // ✅ Make currentUser reactive
  const [currentUser, setCurrentUser] = useState({ id: 1, username: 'Guest' });

  // ✅ State for pending messages
  const [pendingMessages, setPendingMessages] = useState(new Map());

  // ✅ State for typing indicators
  const [typingUsers, setTypingUsers] = useState(new Set());

  // ✅ State for edit mode
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // 💬 Initialize socket
  useEffect(() => {
    if (!currentUser.id || currentUser.username === 'Guest') {
      console.log("⚠️ User not ready, skipping socket connection");
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);
    newSocket.emit('joinCommunity', id);
    console.log(`✅ ${currentUser.username} joined room ${id}`);

    newSocket.on('userTyping', ({ username, isTyping }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        if (isTyping) next.add(username);
        else next.delete(username);
        return next;
      });
    });

    newSocket.on('messageEdited', ({ id: messageId, message: newContent, edited_at }) => {
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, message: newContent, edited_at } : msg)
      );
    });

    newSocket.on('messageDeleted', ({ id: messageId }) => {
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, is_deleted: true } : msg)
      );
    });

    newSocket.on('receiveMessage', (msg) => {
      setMessages(prev => {
        const matchingOptimisticIndex = prev.findIndex(existingMsg =>
          existingMsg.id.toString().startsWith('temp-') &&
          existingMsg.message === msg.message &&
          existingMsg.userId === msg.userId
        );

        if (matchingOptimisticIndex !== -1) {
          const updated = [...prev];
          updated[matchingOptimisticIndex] = { ...msg };
          return updated;
        } else {
          return [...prev, msg];
        }
      });
    });

    newSocket.on('errorMessage', (msg) => alert(msg));

    return () => {
      if (newSocket) {
        newSocket.emit('leaveCommunity', id);
        console.log(`🚪 ${currentUser.username} left room ${id}`);
        newSocket.disconnect();
      }
    };
  }, [id, currentUser]);

  // 📥 Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${SOCKET_SERVER_URL}/communities/${id}/messages`);
        const data = await res.json();
        setMessages(
          data.map((msg) => ({
            id: msg.id,
            communityId: msg.community_id,
            userId: msg.user_id,
            message: msg.message,
            timestamp: msg.timestamp,
            senderName: msg.sender_name || 'Anonymous',
            is_deleted: msg.is_deleted || false,
            edited_at: msg.edited_at || null,
          }))
        );
      } catch (err) {
        console.error('Failed to load message history:', err);
      }
    };

    fetchMessages();
  }, [id]);

  // 📤 Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    const msgContent = message.trim();
    const tempId = `temp-${Date.now()}`;

    setPendingMessages(prev => {
      const next = new Map(prev);
      next.set(tempId, { content: msgContent, userId: currentUser.id });
      return next;
    });

    const optimisticMessage = {
      id: tempId,
      communityId: id,
      userId: currentUser.id,
      message: msgContent,
      timestamp: new Date().toISOString(),
      senderName: currentUser.username,
      is_deleted: false,
      edited_at: null,
    };

    setMessages(prev => [...prev, optimisticMessage]);

    socket.emit('sendMessage', {
      communityId: id,
      userId: currentUser.id,
      message: msgContent,
    });

    setMessage('');
  };

  // 🖊️ Handle typing
  const handleTyping = (value) => {
    if (!socket || !currentUser.username) return;

    const isTyping = value.trim().length > 0;

    socket.emit('typing', {
      communityId: id,
      username: currentUser.username,
      isTyping,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          communityId: id,
          username: currentUser.username,
          isTyping: false,
        });
      }, 2000);
    }
  };

  // ✏️ Edit
  const handleEditMessage = (msg) => {
    if (msg.userId !== currentUser.id || msg.is_deleted) return;
    setEditingMessageId(msg.id);
    setEditContent(msg.message);
  };

  const handleSaveEdit = (messageId) => {
    if (!editContent.trim() || !socket) return;

    setMessages(prev =>
      prev.map(msg => msg.id === messageId ? { ...msg, message: editContent, edited_at: new Date().toISOString() } : msg)
    );

    socket.emit('editMessage', {
      messageId,
      newContent: editContent,
      userId: currentUser.id,
    });

    setEditingMessageId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  // 🗑️ Delete
  const handleDeleteMessage = (messageId) => {
    if (!window.confirm("Are you sure?")) return;

    setMessages(prev =>
      prev.map(msg => msg.id === messageId ? { ...msg, is_deleted: true } : msg)
    );

    socket.emit('deleteMessage', {
      messageId,
      userId: currentUser.id,
    });
  };

  // ✅ Load user
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          setCurrentUser(user);
        } catch (e) {
          setCurrentUser({ id: 1, username: 'Guest' });
        }
      } else {
        setCurrentUser({ id: 1, username: 'Guest' });
      }
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ChatHeader onBack={() => navigate('/Community')} />

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6 mb-6 h-96 overflow-y-auto">
          <MessageList
            messages={messages}
            currentUser={currentUser}
            editingMessageId={editingMessageId}
            editContent={editContent}
            setEditContent={setEditContent}
            onEditMessage={handleEditMessage}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDeleteMessage={handleDeleteMessage}
          />

          <TypingIndicator typingUsers={typingUsers} />
        </div>

        <ChatInput
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default CommunityChat;