// components/ChatInbox.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PrivateChat from './privateChat';

export default function ChatInbox() {
  const [conversations, setConversations] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [showTherapistList, setShowTherapistList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (e) {
        console.error('Invalid token');
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get('/api/therapist/chat/conversations');
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser]);

  const fetchTherapists = async () => {
    try {
      const res = await axiosInstance.get('/api/therapist/therapists');
      setTherapists(res.data);
    } catch (err) {
      console.error('Failed to load therapists', err);
    }
  };

  const handleNewChat = () => {
    if (!currentUser?.isTherapist) {
      fetchTherapists();
      setShowTherapistList(true);
    }
  };

  const selectTherapist = (therapist) => {
    setSelectedPartnerId(therapist.id);
    setShowTherapistList(false);
  };

  const formatLastMessageTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (date.toDateString() === now.toDateString()) return 'Today';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full max-w-xs border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            {showTherapistList ? 'Therapists' : 'Messages'}
          </h1>
          {!showTherapistList && !currentUser?.isTherapist && (
            <button
              onClick={handleNewChat}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition shadow-sm"
            >
              + New
            </button>
          )}
          {showTherapistList && (
            <button
              onClick={() => setShowTherapistList(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && !showTherapistList ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : showTherapistList ? (
            <div className="p-2 space-y-2">
              {therapists.length === 0 ? (
                <p className="text-gray-500 text-center py-8 px-4">No therapists available.</p>
              ) : (
                therapists.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => selectTherapist(t)}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
                  >
                    {t.profile_pic ? (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${t.profile_pic}`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mr-3 text-white font-semibold shadow-sm">
                        {t.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{t.username}</div>
                      {t.specialty && (
                        <div className="text-sm text-gray-500 truncate">{t.specialty}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {currentUser?.isTherapist
                  ? 'No conversations yet'
                  : 'Start your first chat'}
              </h3>
              <p className="text-gray-600 text-sm">
                {currentUser?.isTherapist
                  ? 'Patients will appear here once they message you.'
                  : 'Click "New" to connect with a therapist.'}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedPartnerId(conv.other_user.id)}
                  className={`p-3 rounded-xl cursor-pointer transition ${
                    selectedPartnerId === conv.other_user.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 truncate">
                      {conv.other_user.username}
                    </div>
                    {conv.last_message?.created_at && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatLastMessageTime(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  {conv.last_message && (
                    <div className="text-sm text-gray-600 truncate mt-1">
                      {conv.last_message.is_deleted
                        ? 'This message was deleted.'
                        : conv.last_message.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedPartnerId ? (
          <PrivateChat
            recipientId={selectedPartnerId}
            onBack={() => setSelectedPartnerId(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500 max-w-md px-6">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Messages</h2>
              <p className="text-gray-600">
                {showTherapistList
                  ? 'Select a therapist to start chatting'
                  : currentUser?.isTherapist
                  ? 'Select a patient to reply'
                  : 'Click “New” to begin a conversation'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}