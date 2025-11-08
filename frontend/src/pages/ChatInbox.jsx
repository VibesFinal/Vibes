// components/ChatInbox.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import PrivateChat from './privateChat';
import { showAlert, handleError } from '../utils/alertUtils';

const gradientClasses = {
  container: 'bg-gradient-to-br from-[#FCF0F8] via-[#F5E1F0] to-[#D473B3]',
  newChatButton: 'bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] text-white font-bold rounded-2xl px-4 py-2.5 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 ring-2 ring-white',
  activeConversation: 'bg-gradient-to-r from-[#C05299]/10 to-[#D473B3]/10 border-2 border-[#D473B3]/40',
};

export default function ChatInbox() {
  const [conversations, setConversations] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [showTherapistList, setShowTherapistList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract current user from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (e) {
        console.error('Invalid token');
        showAlert('Session expired. Please log in again.');
        // Optional: redirect to login
      }
    }
  }, []);

  // Fetch conversations
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

  // Fetch therapists (for patients)
  const fetchTherapists = async () => {
    try {
      const res = await axiosInstance.get('/api/therapist/therapists');
      setTherapists(res.data);
    } catch (err) {
      console.error('Failed to load therapists', err);
      handleError(err);
      showAlert('Failed to load therapists');
    }
  };

  const handleNewChat = () => {
    if (!currentUser?.isTherapist) {
      fetchTherapists();
      setShowTherapistList(true);
      setSelectedPartnerId(null);
    }
  };

  const selectTherapist = (therapist) => {
    setSelectedPartnerId(therapist.id);
    setShowTherapistList(false);
  };

  // Format time for last message
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

  // Search filtering
  const filteredTherapists = therapists.filter(therapist =>
    therapist.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (therapist.specialty && therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle real-time conversation updates (edit/delete/send)
  const handleConversationUpdate = useCallback(({ other_user_id, last_message }) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.other_user.id === other_user_id
          ? { 
              ...conv, 
              last_message: last_message,
              updated_at: last_message?.created_at || new Date().toISOString()
            }
          : conv
      )
    );
  }, []);

  // Responsive: hide sidebar on mobile when chat open
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const showSidebar = !(isMobile && selectedPartnerId);

  return (
    <div className={`${gradientClasses.container} flex flex-col md:flex-row h-screen w-full overflow-hidden`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full md:w-80 lg:w-96 bg-white/95 backdrop-blur-sm border-r-2 border-[#D473B3]/20 flex flex-col max-h-screen">
          <div className="h-1 w-full bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8]"></div>

          <div className="p-4 md:p-6 border-b-2 border-[#D473B3]/20">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] bg-clip-text text-transparent">
                {showTherapistList ? 'Find Therapists' : 'Messages'}
              </h1>
              {!showTherapistList && !currentUser?.isTherapist && (
                <button
                  onClick={handleNewChat}
                  className={gradientClasses.newChatButton}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm md:text-base">New</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder={showTherapistList ? "Search therapists..." : "Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 text-sm md:text-base bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0] border-2 border-[#D473B3]/30 rounded-xl focus:ring-2 focus:ring-[#D473B3] focus:border-transparent outline-none placeholder-gray-500"
              />
              <svg className="w-5 h-5 text-[#C05299] absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 md:p-4">
            {loading && !showTherapistList ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-2.5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : showTherapistList ? (
              <div className="space-y-3">
                {filteredTherapists.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#C05299] to-[#D473B3] rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-700">No therapists found</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {searchTerm ? 'Try different keywords' : 'None available'}
                    </p>
                  </div>
                ) : (
                  filteredTherapists.map((therapist) => (
                    <div
                      key={therapist.id}
                      onClick={() => selectTherapist(therapist)}
                      className="flex items-start p-4 rounded-xl hover:bg-[#F5E1F0] cursor-pointer transition-colors border border-transparent hover:border-[#D473B3]/30"
                    >
                      {therapist.profile_pic ? (
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}${therapist.profile_pic}`}
                          alt="Profile"
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-3 ring-2 ring-white"
                        />
                      ) : (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center text-white font-bold text-sm md:text-base mr-3">
                          {therapist.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 text-sm md:text-base">
                          {therapist.username}
                        </div>
                        {therapist.specialty && (
                          <div className="text-xs md:text-sm text-[#C05299] bg-[#F5E1F0] px-2 py-1 rounded-full inline-block font-semibold mt-1">
                            {therapist.specialty}
                          </div>
                        )}
                        {therapist.bio && (
                          <p className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2">
                            {therapist.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#C05299] to-[#D473B3] rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                  {currentUser?.isTherapist ? 'No conversations' : 'Start your journey'}
                </h3>
                {!currentUser?.isTherapist && (
                  <button
                    onClick={handleNewChat}
                    className={`${gradientClasses.newChatButton} mt-3 px-5 py-2 text-sm`}
                  >
                    Find a Therapist
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedPartnerId(conversation.other_user.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-colors ${
                      selectedPartnerId === conversation.other_user.id
                        ? gradientClasses.activeConversation
                        : 'hover:bg-[#F5E1F0]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {conversation.other_user.profile_pic ? (
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}${conversation.other_user.profile_pic}`}
                          alt="Profile"
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center text-white font-bold text-sm md:text-base">
                          {conversation.other_user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-bold text-gray-800 text-sm md:text-base truncate">
                            {conversation.other_user.username}
                          </div>
                          {conversation.last_message?.created_at && (
                            <span className="text-xs text-[#C05299] font-semibold whitespace-nowrap ml-2">
                              {formatLastMessageTime(conversation.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        {/* ✅ HANDLE EDITED & DELETED MESSAGES */}
                        {conversation.last_message ? (
                          <div className="text-xs md:text-sm text-gray-600 truncate mt-1">
                            {conversation.last_message.is_deleted ? (
                              <span className="text-gray-400 italic">No recent messages</span>
                            ) : (
                              <>
                                {conversation.last_message.content}
                                {conversation.last_message.is_edited && (
                                  <span className="text-[#C05299] ml-1">(edited)</span>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs md:text-sm text-gray-500 italic mt-1">
                            No messages yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User footer */}
          <div className="p-4 border-t-2 border-[#D473B3]/20 bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-gray-800 text-sm truncate">
                  {currentUser?.username || 'User'}
                </div>
                <div className="text-xs text-[#C05299] font-semibold">
                  {currentUser?.isTherapist ? 'Therapist' : 'Patient'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedPartnerId ? (
          <PrivateChat
            recipientId={selectedPartnerId}
            onBack={() => setSelectedPartnerId(null)}
            onConversationUpdate={handleConversationUpdate}  // ✅ Critical!
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#FCF0F8] via-[#F5E1F0] to-[#E8A5D8]/40 p-4">
            <div className="text-center text-gray-600 max-w-md">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 bg-gradient-to-br from-[#C05299] via-[#D473B3] to-[#E8A5D8] rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
                <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] bg-clip-text text-transparent mb-4">
                {showTherapistList ? 'Select a Therapist' : 'Welcome'}
              </h2>
              <p className="text-sm md:text-base mb-6">
                {showTherapistList
                  ? 'Choose a therapist to start messaging'
                  : currentUser?.isTherapist
                  ? 'Select a conversation from the list'
                  : 'Start a new conversation for support'}
              </p>
              {!currentUser?.isTherapist && !showTherapistList && (
                <button
                  onClick={handleNewChat}
                  className={`${gradientClasses.newChatButton} px-6 py-3 text-sm md:text-base`}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start Conversation
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}