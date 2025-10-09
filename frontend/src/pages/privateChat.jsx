// pages/PrivateChat.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import ChatHeader from '../components/ChatComponents/ChatHeader';
import MessageList from '../components/ChatComponents/MessageList';
import MessageInput from '../components/ChatComponents/MessageInput';
import DeleteConfirmationModal from '../components/ChatComponents/DeleteConfirmationModal';

const SOCKET_URL = 'http://localhost:7777';

const PrivateChat = ({ recipientId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [deleteConfirmMessageId, setDeleteConfirmMessageId] = useState(null);
  const [recipientName, setRecipientName] = useState('Therapist');

  const token = localStorage.getItem('token');

  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
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
      }
    };
    fetch();
  }, [recipientId, token]);

  useEffect(() => {
    if (!token || !recipientId) return;

    const newSocket = io(SOCKET_URL, { auth: { token }, transports: ['websocket'] });
    setSocket(newSocket);

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
      alert('Failed to send message');
    });

    return () => newSocket.close();
  }, [recipientId, token, currentUserId, recipientName]);

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
      }
    };
    fetchHistory();
  }, [recipientId, token]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    socket.emit('sendPrivateMessage', { recipientId, content: newMessage.trim() });
    setNewMessage('');
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
    <div className="max-w-3xl mx-auto w-full h-full">
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
        <ChatHeader recipientName={recipientName} onBack={onBack} />
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
        />
        <DeleteConfirmationModal
          isOpen={deleteConfirmMessageId !== null}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default PrivateChat