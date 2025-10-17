// components/ChatInbox.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PrivateChat from './privateChat';

// Custom styles with the color palette
const chatInboxStyles = {
  container: {
    background: 'linear-gradient(135deg, #F0F0F0 0%, #DCC6A0 30%, #9FD6E2 100%)',
    minHeight: '100vh'
  },
  sidebar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(184, 233, 134, 0.3)',
    boxShadow: '5px 0 15px rgba(0, 0, 0, 0.08)'
  },
  gradientBorder: {
    background: 'linear-gradient(90deg, #B8E986, #73C174, #9FD6E2, #DCC6A0)',
    height: '3px',
    width: '100%'
  },
  newChatButton: {
    background: 'linear-gradient(135deg, #B8E986 0%, #73C174 100%)',
    boxShadow: '0 4px 15px rgba(115, 193, 116, 0.3)'
  },
  activeConversation: {
    background: 'linear-gradient(135deg, rgba(184, 233, 134, 0.15) 0%, rgba(115, 193, 116, 0.1) 100%)',
    border: '1px solid rgba(184, 233, 134, 0.3)'
  }
};

export default function ChatInbox() {
  const [conversations, setConversations] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [showTherapistList, setShowTherapistList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredTherapists = therapists.filter(therapist =>
    therapist.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (therapist.specialty && therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={chatInboxStyles.container} className="flex h-screen">
      {/* Sidebar */}
      <div style={chatInboxStyles.sidebar} className="w-full max-w-md flex flex-col">
        {/* Gradient Border */}
        <div style={chatInboxStyles.gradientBorder}></div>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {showTherapistList ? 'Find Therapists' : 'Messages'}
            </h1>
            {!showTherapistList && !currentUser?.isTherapist && (
              <button
                onClick={handleNewChat}
                style={chatInboxStyles.newChatButton}
                className="text-white font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Chat</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={showTherapistList ? "Search therapists..." : "Search conversations..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#73C174] focus:border-transparent transition-all duration-200"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && !showTherapistList ? (
            <div className="flex flex-col space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : showTherapistList ? (
            <div className="p-4 space-y-3">
              {filteredTherapists.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#9FD6E2] to-[#DCC6A0] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">No therapists found</h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? 'Try adjusting your search terms' : 'No therapists available at the moment'}
                  </p>
                </div>
              ) : (
                filteredTherapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    onClick={() => selectTherapist(therapist)}
                    className="flex items-center p-4 rounded-2xl hover:bg-gradient-to-r hover:from-[#B8E986]/10 hover:to-[#9FD6E2]/10 cursor-pointer transition-all duration-300 group border border-transparent hover:border-[#B8E986]/30"
                  >
                    {therapist.profile_pic ? (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${therapist.profile_pic}`}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B8E986] to-[#73C174] flex items-center justify-center mr-4 text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {therapist.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-lg mb-1">
                        {therapist.username}
                      </div>
                      {therapist.specialty && (
                        <div className="text-sm text-gray-600 bg-[#F0F0F0] px-2 py-1 rounded-full inline-block">
                          {therapist.specialty}
                        </div>
                      )}
                      {therapist.bio && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {therapist.bio}
                        </p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#73C174] transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))
              )}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#B8E986] to-[#9FD6E2] rounded-full flex items-center justify-center mb-6 shadow-xl">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {currentUser?.isTherapist ? 'No conversations yet' : 'Start your healing journey'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                {currentUser?.isTherapist
                  ? 'Your patients will appear here once they start messaging you.'
                  : 'Connect with a qualified therapist to begin your mental wellness journey.'}
              </p>
              {!currentUser?.isTherapist && (
                <button
                  onClick={handleNewChat}
                  style={chatInboxStyles.newChatButton}
                  className="text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Find a Therapist
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedPartnerId(conversation.other_user.id)}
                  style={selectedPartnerId === conversation.other_user.id ? chatInboxStyles.activeConversation : {}}
                  className="p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#B8E986]/10 hover:to-[#9FD6E2]/10 group border border-transparent hover:border-[#B8E986]/30"
                >
                  <div className="flex items-center space-x-4">
                    {conversation.other_user.profile_pic ? (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${conversation.other_user.profile_pic}`}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B8E986] to-[#73C174] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {conversation.other_user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-gray-800 text-lg truncate">
                          {conversation.other_user.username}
                        </div>
                        {conversation.last_message?.created_at && (
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatLastMessageTime(conversation.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      
                      {conversation.last_message && (
                        <div className="text-sm text-gray-600 truncate flex items-center">
                          {conversation.last_message.is_deleted ? (
                            <span className="text-gray-400 italic flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Message deleted
                            </span>
                          ) : (
                            <>
                              <span className="truncate">{conversation.last_message.content}</span>
                              {conversation.last_message.is_edited && (
                                <span className="text-xs text-gray-400 ml-1 whitespace-nowrap">(edited)</span>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 bg-white/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#DCC6A0] to-[#9FD6E2] rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">
                {currentUser?.username || 'User'}
              </div>
              <div className="text-xs text-gray-500">
                {currentUser?.isTherapist ? 'Therapist' : 'Patient'}
              </div>
            </div>
          </div>
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
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0]/30">
            <div className="text-center text-gray-600 max-w-md px-8">
              <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-[#B8E986] to-[#9FD6E2] rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {showTherapistList ? 'Select a Therapist' : 'Welcome to Chat'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {showTherapistList
                  ? 'Choose a therapist to start your conversation'
                  : currentUser?.isTherapist
                  ? 'Select a conversation from the sidebar to begin'
                  : 'Start a new conversation with a therapist to get support'}
              </p>
              {!currentUser?.isTherapist && !showTherapistList && (
                <button
                  onClick={handleNewChat}
                  style={chatInboxStyles.newChatButton}
                  className="text-white font-semibold px-8 py-4 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Start New Conversation</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}