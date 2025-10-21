import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { showAlert, handleError } from '../utils/alertUtils';

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const searchInputRef = useRef(null);

  const allTags = useMemo(() => {
    return [...new Set(communities.flatMap(comm => comm.tags || []))];
  }, [communities]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCommunities = async () => {
      try {
        setIsLoading(true);

        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filterTag) params.tag = filterTag;

        const response = await axiosInstance.get('/communities', {
          params,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          const sortedCommunities = (response.data.communities || []).sort((a, b) => {
            // Sort by: joined first, then by member count descending
            if (a.is_joined !== b.is_joined) {
              return b.is_joined - a.is_joined;
            }
            return b.member_count - a.member_count;
          });
          setCommunities(sortedCommunities);
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error("Failed to fetch communities:", err);
          handleError(err);  
          showAlert("Failed to load communities. Please refresh.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCommunities();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchTerm, filterTag]);

  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [communities]);

  const handleLeaveCommunity = async (id) => {
    if (!window.confirm("Are you sure you want to leave this community? You can join again anytime.")) {
      return;
    }

    try {
      const response = await axiosInstance.patch(`/communities/${id}/join`);
      const updatedCommunity = response.data.data; // ← Access nested data

      setCommunities(prev => {
        const updated = prev.map(comm =>
          comm.id === updatedCommunity.id 
            ? { ...comm, is_joined: updatedCommunity.is_joined, member_count: updatedCommunity.member_count }
            : comm
        );
        
        // Re-sort after leaving: joined first, then by member count
        return updated.sort((a, b) => {
          if (a.is_joined !== b.is_joined) {
            return b.is_joined - a.is_joined;
          }
          return b.member_count - a.member_count;
        });
      });

      showAlert(`You left the community.`);
    } catch (err) {
      console.error("Failed to leave community:", err);
      showAlert("Failed to leave. Please try again.");
      handleError(err);
    }
  };

  const handleJoinCommunity = async (id) => {
    try {
      const response = await axiosInstance.patch(`/communities/${id}/join`);
      const updatedCommunity = response.data.data; // ← Access nested data

      setCommunities(prev => {
        const updated = prev.map(comm =>
          comm.id === updatedCommunity.id 
            ? { ...comm, is_joined: updatedCommunity.is_joined, member_count: updatedCommunity.member_count }
            : comm
        );
        
        // Re-sort after joining: joined first, then by member count
        return updated.sort((a, b) => {
          if (a.is_joined !== b.is_joined) {
            return b.is_joined - a.is_joined;
          }
          return b.member_count - a.member_count;
        });
      });

      showAlert(`You joined the community.`);
      navigate(`/communities/${id}/chat`);
    } catch (err) {
      console.error("Failed to update join status:", err);
      showAlert("Failed to update community status. Please try again.");
      handleError(err);
    }
  };

  if (isLoading && communities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-16 w-16 border-t-4 border-b-4 border-[#C05299]/30 mx-auto mb-6"></div>
          <p className="text-[#1e293b] text-lg font-medium tracking-wide">Gathering your safe spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle floating blobs (matches Feed & Chat) */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 -left-16 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 -right-16 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-14 max-w-4xl mx-auto">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-[#C05299]/10 rounded-full blur-lg"></div>
            <h1 className="relative text-4xl sm:text-5xl font-bold text-[#1e293b] mb-4 tracking-tight">
              Welcome to Your{' '}
              <span className="bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent">
                Support Circles
              </span>
            </h1>
          </div>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed font-medium">
            Find your tribe. Breathe easier. Grow together. You belong here.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="max-w-5xl mx-auto mb-14 flex flex-col sm:flex-row gap-5 items-center justify-center flex-wrap">
          <div className="relative w-full sm:w-72 lg:w-96">
            <input
              ref={searchInputRef}
              key="search-input"
              type="text"
              placeholder="Search for support..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
              }}
              autoComplete="off"
              spellCheck="false"
              className="w-full px-5 py-3 pl-12 border border-[#e9d5ff] rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-3 focus:ring-[#C05299]/30 focus:border-[#C05299]/50 transition-all duration-300 placeholder:text-[#64748b]/60 text-[#1e293b]"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C05299]/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-5 py-3 border border-[#e9d5ff] rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-3 focus:ring-[#C05299]/30 focus:border-[#C05299]/50 transition-all duration-300 text-[#1e293b]"
          >
            <option value="">All Topics</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag} className="capitalize">
                {tag.replace('-', ' ')}
              </option>
            ))}
          </select>

          <Link
            to="/community/create"
            className="px-6 py-3 bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] text-white font-medium rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap border border-[#e9d5ff]/50"
          >
            🌱 Create Community
          </Link>
        </div>

        {/* Communities Grid */}
        <div className="px-2">
          {communities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {communities.map((comm) => (
                <div
                  key={comm.id}
                  className="group bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl hover:shadow-2xl border border-[#e9d5ff]/50 hover:border-[#C05299]/30 transition-all duration-500 p-7 flex flex-col hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C05299] to-[#D473B3]"></div>

                  <div className="text-5xl mb-4 text-center drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {comm.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-3 leading-tight">{comm.name}</h3>
                  <p className="text-[#64748b] text-sm leading-relaxed mb-5 flex-grow">
                    {comm.description}
                  </p>

                  <div className="flex justify-between items-start mb-5 flex-wrap gap-2">

                    <div className="flex flex-wrap gap-1.5">
                      {comm.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gradient-to-r from-[#f5f3ff] to-[#fdf2f8] text-[#C05299] text-xs px-2.5 py-1 rounded-full font-medium border border-[#e9d5ff]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Button Group */}
                  <div className="flex flex-col gap-2">
                    <button
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg ${
                        comm.is_joined
                          ? 'bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] text-white shadow-lg'
                          : 'bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] text-white shadow-lg'
                      }`}
                      onClick={() => {
                        if (comm.is_joined) {
                          navigate(`/communities/${comm.id}/chat`);
                        } else {
                          handleJoinCommunity(comm.id);
                        }
                      }}
                    >
                      {comm.is_joined ? '💬 Enter Chat' : '💜 Join Circle'}
                    </button>

                    {comm.is_joined && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveCommunity(comm.id);
                        }}
                        className="w-full py-2 px-4 text-xs font-medium text-[#C05299] bg-[#fdf2f8] hover:bg-[#fdebf5] rounded-xl transition-all duration-300 border border-[#e9d5ff] hover:border-[#C05299]/30 hover:shadow-md"
                      >
                        🌸 Leave Circle
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-[#e9d5ff] mx-auto max-w-3xl">
              <div className="text-6xl mb-4 opacity-70">🕊️</div>
              <h3 className="text-xl font-medium text-[#1e293b] mb-2">
                No communities match your search
              </h3>
              <p className="text-[#64748b]">Try a different keyword or explore all topics above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Shared blob animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Community;