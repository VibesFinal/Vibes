// components/ChatInbox.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PrivateChat from './privateChat';
import { showAlert, handleError } from '../utils/alertUtils';

// Custom styles with pink gradient theme
const chatInboxStyles = {
  container: {
    background: 'linear-gradient(135deg, #FCF0F8 0%, #F5E1F0 30%, #E8A5D8 60%, #D473B3 100%)',
    minHeight: '100vh'
  },
  sidebar: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(15px)',
    borderRight: '2px solid rgba(212, 115, 179, 0.2)',
    boxShadow: '8px 0 20px rgba(192, 82, 153, 0.15)'
  },
  gradientBorder: {
    background: 'linear-gradient(90deg, #C05299, #D473B3, #E8A5D8, #F5E1F0)',
    height: '4px',
    width: '100%'
  },
  newChatButton: {
    background: 'linear-gradient(135deg, #C05299 0%, #D473B3 50%, #E8A5D8 100%)',
    boxShadow: '0 6px 20px rgba(192, 82, 153, 0.4)'
  },
  activeConversation: {
    background: 'linear-gradient(135deg, rgba(192, 82, 153, 0.15) 0%, rgba(212, 115, 179, 0.1) 100%)',
    border: '2px solid rgba(212, 115, 179, 0.4)'
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
        handleError(err);
        showAlert('Failed to load conversations');
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
      handleError(err);
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
        <div className="p-6 border-b-2 border-[#D473B3]/20">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] bg-clip-text text-transparent">
              {showTherapistList ? 'Find Therapists' : 'Messages'}
            </h1>
            {!showTherapistList && !currentUser?.isTherapist && (
              <button
                onClick={handleNewChat}
                style={chatInboxStyles.newChatButton}
                className="text-white font-bold px-5 py-3 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 ring-2 ring-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Chat</span>
              </button>
            )}
          </div>

          {/* Search Bar with pink theme */}
          <div className="relative">
            <input
              type="text"
              placeholder={showTherapistList ? "Search therapists..." : "Search conversations..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0] border-2 border-[#D473B3]/30 rounded-2xl focus:ring-2 focus:ring-[#D473B3] focus:border-transparent transition-all duration-300 font-medium text-gray-700 placeholder-gray-400"
            />
            <svg className="w-6 h-6 text-[#C05299] absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && !showTherapistList ? (
            <div className="flex flex-col space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#F5E1F0] to-[#FCF0F8] rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gradient-to-r from-[#F5E1F0] to-[#FCF0F8] rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-[#F5E1F0] to-[#FCF0F8] rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : showTherapistList ? (
            <div className="p-4 space-y-4">
              {filteredTherapists.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#C05299] to-[#D473B3] rounded-full flex items-center justify-center shadow-2xl ring-4 ring-[#F5E1F0]">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-700 mb-3 text-xl">No therapists found</h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? 'Try adjusting your search terms' : 'No therapists available at the moment'}
                  </p>
                </div>
              ) : (
                filteredTherapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    onClick={() => selectTherapist(therapist)}
                    className="flex items-center p-5 rounded-2xl hover:bg-gradient-to-r hover:from-[#C05299]/10 hover:to-[#D473B3]/10 cursor-pointer transition-all duration-300 group border-2 border-transparent hover:border-[#D473B3]/40 shadow-sm hover:shadow-xl"
                  >
                    {therapist.profile_pic ? (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${therapist.profile_pic}`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover mr-4 border-3 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 ring-2 ring-[#D473B3]/30"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center mr-4 text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-300 ring-2 ring-white">
                        {therapist.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-lg mb-1">
                        {therapist.username}
                      </div>
                      {therapist.specialty && (
                        <div className="text-sm text-[#C05299] bg-[#F5E1F0] px-3 py-1 rounded-full inline-block font-semibold">
                          {therapist.specialty}
                        </div>
                      )}
                      {therapist.bio && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {therapist.bio}
                        </p>
                      )}
                    </div>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-[#D473B3] transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))
              )}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-36 h-36 bg-gradient-to-br from-[#C05299] via-[#D473B3] to-[#E8A5D8] rounded-full flex items-center justify-center mb-8 shadow-2xl ring-4 ring-[#F5E1F0]">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent mb-4">
                {currentUser?.isTherapist ? 'No conversations yet' : 'Start your healing journey'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
                {currentUser?.isTherapist
                  ? 'Your patients will appear here once they start messaging you.'
                  : 'Connect with a qualified therapist to begin your mental wellness journey.'}
              </p>
              {!currentUser?.isTherapist && (
                <button
                  onClick={handleNewChat}
                  style={chatInboxStyles.newChatButton}
                  className="text-white font-bold px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ring-2 ring-white"
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
                  className="p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C05299]/10 hover:to-[#D473B3]/10 group border-2 border-transparent hover:border-[#D473B3]/40 shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center space-x-4">
                    {conversation.other_user.profile_pic ? (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${conversation.other_user.profile_pic}`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 ring-2 ring-[#D473B3]/30"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-300 ring-2 ring-white">
                        {conversation.other_user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-gray-800 text-lg truncate">
                          {conversation.other_user.username}
                        </div>
                        {conversation.last_message?.created_at && (
                          <span className="text-xs text-[#C05299] font-semibold whitespace-nowrap ml-2">
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
                                <span className="text-xs text-[#C05299] ml-1 whitespace-nowrap font-semibold">(edited)</span>
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

        {/* User Profile Footer with pink theme */}
        <div className="p-5 border-t-2 border-[#D473B3]/20 bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C05299] to-[#D473B3] rounded-full flex items-center justify-center text-white font-bold shadow-xl ring-2 ring-white">
              {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-800 text-base truncate">
                {currentUser?.username || 'User'}
              </div>
              <div className="text-xs text-[#C05299] font-semibold">
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
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#FCF0F8] via-[#F5E1F0] to-[#E8A5D8]/40">
            <div className="text-center text-gray-600 max-w-md px-8">
              <div className="w-56 h-56 mx-auto mb-10 bg-gradient-to-br from-[#C05299] via-[#D473B3] to-[#E8A5D8] rounded-full flex items-center justify-center shadow-2xl ring-8 ring-white">
                <svg className="w-28 h-28 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] bg-clip-text text-transparent mb-5">
                {showTherapistList ? 'Select a Therapist' : 'Welcome to Chat'}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
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
                  className="text-white font-bold px-10 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg ring-2 ring-white"
                >
                  <span className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
