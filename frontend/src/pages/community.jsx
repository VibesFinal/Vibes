import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Preserve input focus across re-renders
  const searchInputRef = useRef(null);

  // 💡 Memoize tags to prevent unnecessary re-renders of <select>
  const allTags = useMemo(() => {
    return [...new Set(communities.flatMap(comm => comm.tags || []))];
  }, [communities]);

  // 🔄 Fetch communities with debounce + cancellation
  useEffect(() => {
    const controller = new AbortController(); // 🔥 Cancel previous requests

    const fetchCommunities = async () => {
      try {
        setIsLoading(true);

        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filterTag) params.tag = filterTag;

        const response = await axiosInstance.get('/communities', {
          params,
          signal: controller.signal, // 🔥 Bind to controller
        });

        // Only update if component is still mounted
        if (!controller.signal.aborted) {
          setCommunities(response.data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error("Failed to fetch communities:", err);
          alert("Failed to load communities. Please refresh.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    // 🔥 DEBOUNCE: Wait 300ms after user stops typing
    const debounceTimer = setTimeout(() => {
      fetchCommunities();
    }, 300);

    // Cleanup: Cancel fetch + clear timer
    return () => {
      clearTimeout(debounceTimer);
      controller.abort(); // 🔥 Cancel in-flight request
    };
  }, [searchTerm, filterTag]); // ✅ Depend on actual searchTerm — not debounced

  // 🔥 Refocus input after render if it was focused
  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [communities]); // Only after communities update

  // Handle join/leave
  const handleJoinCommunity = async (id) => {
    try {
      const response = await axiosInstance.patch(`/communities/${id}/join`);
      const updatedCommunity = response.data;

      setCommunities(prev =>
        prev.map(comm =>
          comm.id === updatedCommunity.id ? updatedCommunity : comm
        )
      );

      const action = updatedCommunity.is_joined ? 'joined' : 'left';
      alert(`You ${action} the community.`);
    } catch (err) {
      console.error("Failed to update join status:", err);
      alert("Failed to update community status. Please try again.");
    }
  };

  if (isLoading && communities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-300 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium tracking-wide">Gathering your safe spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="text-center mb-14 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 tracking-tight">
          Welcome to Your <span className="text-indigo-600">Support Circles</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Find your tribe. Breathe easier. Grow together. You belong here.
        </p>
      </header>

      {/* Search & Filter Bar */}
      <div className="max-w-5xl mx-auto mb-14 flex flex-col sm:flex-row gap-5 items-center justify-center flex-wrap">
        <div className="relative w-full sm:w-72 lg:w-96">
          <input
            ref={searchInputRef} // 🔥 Preserve focus
            key="search-input"
            type="text"
            placeholder="Search for support..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            autoComplete="off"
            spellCheck="false"
            className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-3 focus:ring-indigo-300 transition-all duration-300 placeholder:text-gray-400"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-5 py-3 border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-3 focus:ring-indigo-300 transition-all duration-300 text-gray-700"
        >
          <option value="">All Topics</option>
          {allTags.map(tag => (
            <option key={tag} value={tag} className="capitalize">
              {tag.replace('-', ' ')}
            </option>
          ))}
        </select>

        <Link
          to="/community/create"
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
        >
          🌱 Create Community
        </Link>
      </div>

      {/* Communities Grid */}
      <div className="max-w-7xl mx-auto px-2">
        {communities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {communities.map(comm => (
              <div
                key={comm.id}
                className="group bg-white/70 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-xl border border-white/50 hover:border-indigo-200 transition-all duration-500 p-7 flex flex-col hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 text-center drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {comm.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{comm.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-grow">{comm.description}</p>

                <div className="flex justify-between items-start mb-5 flex-wrap gap-2">
                  <span className="text-xs text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded-full">
                    👥 {comm.member_count.toLocaleString()}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comm.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.03] hover:shadow-md ${
                    comm.is_joined
                      ? 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white shadow-md'
                      : 'bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white shadow-md'
                  }`}
                  onClick={() => handleJoinCommunity(comm.id)}
                >
                  {comm.is_joined ? '🌸 Leave Circle' : '💚 Join Circle'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 mx-auto max-w-3xl">
            <div className="text-6xl mb-4 opacity-70">🕊️</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No communities match your search</h3>
            <p className="text-gray-500">Try a different keyword or explore all topics above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;