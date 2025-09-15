import React, { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import reactionsApi from "../api/reactionsApi";
import NewPost from "./newPost";
import Category from "../components/Category";
import ReactionPicker from "../components/ReactionPicker";
import { useNavigate } from "react-router-dom";




// ✅ UNIFIED: Single Post Component with FIXED media persistence
const UnifiedPostCard = ({ post, postReactions, onReactionSelect }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [mediaLoadError, setMediaLoadError] = useState({ photo: false, video: false });
  const navigate = useNavigate();

  // ✅ CRITICAL: Use useRef to persist media data across re-renders
  const mediaDataRef = useRef({
    photo: post.photo,
    video: post.video
  });

  // ✅ CRITICAL: Update ref when post changes but preserve if data exists
  useEffect(() => {
    if (post.photo && !mediaDataRef.current.photo) {
      mediaDataRef.current.photo = post.photo;
    }
    if (post.video && !mediaDataRef.current.video) {
      mediaDataRef.current.video = post.video;
    }
  }, [post.photo, post.video]);

  // Helper: format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Fetch comments for this post
  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${post.id}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Comment cannot be empty");

    setIsLoadingComment(true);
    try {
      await axiosInstance.post(`/comments/${post.id}`, { content: comment });
      setComment("");
      await fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("You must be logged in to comment");
    } finally {
      setIsLoadingComment(false);
    }
  };

  // Toggle comments visibility
  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  // Navigate to user profile
  const goToProfile = () => {
    navigate(`/profile/${post.username}`);
  };

  // ✅ CRITICAL: Use persistent media data from ref
  const currentPhoto = mediaDataRef.current.photo || post.photo;
  const currentVideo = mediaDataRef.current.video || post.video;

  // ✅ ENHANCED: Debug logging with persistent data
  console.log(`🖼️ Post ${post.id} media (PERSISTENT):`, {
    originalPhoto: post.photo,
    originalVideo: post.video,
    persistentPhoto: mediaDataRef.current.photo,
    persistentVideo: mediaDataRef.current.video,
    currentPhoto,
    currentVideo,
    photoUrl: currentPhoto ? `http://localhost:7777/uploads/${currentPhoto}` : null,
    videoUrl: currentVideo ? `http://localhost:7777/uploads/${currentVideo}` : null
  });

  // Handle media load errors
  const handleMediaError = (type, filename) => {
    console.error(`❌ Failed to load ${type}: ${filename}`);
    setMediaLoadError(prev => ({ ...prev, [type]: true }));
  };

  // Handle successful media load
  const handleMediaLoad = (type, filename) => {
    console.log(`✅ ${type} loaded successfully: ${filename}`);
    setMediaLoadError(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 mb-6">
      {/* ✅ UNIFIED: Consistent header for all posts */}
      <div className="flex items-center mb-4">
        {/* Avatar */}
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            post.is_anonymous ? "Anonymous" : (post.username || "User")
          )}&background=14b8a6&color=fff&size=48`}
          alt="User avatar"
          className="w-12 h-12 rounded-full mr-3 border-2 border-teal-100"
        />

        {/* User info and metadata */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 
              onClick={post.is_anonymous ? null : goToProfile} 
              className={`font-semibold text-teal-600 text-lg ${!post.is_anonymous ? 'cursor-pointer hover:text-teal-700' : ''}`}
            >
              @{post.is_anonymous ? "Anonymous" : (post.username || "User")}
            </h3>
            {post.category && (
              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">
                {post.category}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(post.created_at || post.createdAt || post.date)}
          </p>
        </div>
      </div>

      {/* ✅ UNIFIED: Post content */}
      {post.content && (
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed text-base">{post.content}</p>
        </div>
      )}

      {/* ✅ FIXED: Single media display with persistent data and enhanced error handling */}
      {currentPhoto && !mediaLoadError.photo && (
        <div className="mb-4">
          <img
            src={`http://localhost:7777/uploads/${currentPhoto}`}
            alt={post.content ? post.content.substring(0, 50) : "Post image"}
            className="w-full rounded-lg shadow-sm max-h-96 object-cover"
            onLoad={() => handleMediaLoad('photo', currentPhoto)}
            onError={() => handleMediaError('photo', currentPhoto)}
            loading="lazy"
          />
        </div>
      )}

      {/* ✅ FIXED: Error placeholder for failed images */}
      {currentPhoto && mediaLoadError.photo && (
        <div className="mb-4">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
            <div className="text-3xl mb-2">📷</div>
            <div className="font-medium">Image not available</div>
            <div className="text-xs mt-1 text-gray-400">{currentPhoto}</div>
            <button 
              onClick={() => {
                setMediaLoadError(prev => ({ ...prev, photo: false }));
                // Force reload by updating the src
                const img = document.querySelector(`img[src*="${currentPhoto}"]`);
                if (img) {
                  img.src = `http://localhost:7777/uploads/${currentPhoto}?t=${Date.now()}`;
                }
              }}
              className="mt-2 text-xs text-teal-600 hover:text-teal-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {currentVideo && !mediaLoadError.video && (
        <div className="mb-4">
          <video
            src={`http://localhost:7777/uploads/${currentVideo}`}
            controls
            className="w-full rounded-lg shadow-sm max-h-96"
            onLoadedData={() => handleMediaLoad('video', currentVideo)}
            onError={() => handleMediaError('video', currentVideo)}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* ✅ FIXED: Error placeholder for failed videos */}
      {currentVideo && mediaLoadError.video && (
        <div className="mb-4">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
            <div className="text-3xl mb-2">🎥</div>
            <div className="font-medium">Video not available</div>
            <div className="text-xs mt-1 text-gray-400">{currentVideo}</div>
            <button 
              onClick={() => {
                setMediaLoadError(prev => ({ ...prev, video: false }));
                // Force reload by updating the src
                const video = document.querySelector(`video[src*="${currentVideo}"]`);
                if (video) {
                  video.src = `http://localhost:7777/uploads/${currentVideo}?t=${Date.now()}`;
                }
              }}
              className="mt-2 text-xs text-teal-600 hover:text-teal-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ✅ UNIFIED: Actions section */}
      <div className="border-t border-gray-100 pt-4">
        {/* Reactions */}
        <div className="flex justify-between items-center mb-4">
          <ReactionPicker
            reactions={postReactions.reactions}
            userReaction={postReactions.userReaction}
            onReactionSelect={(reactionType) => onReactionSelect(post.id, reactionType)}
            totalReactions={postReactions.totalReactions}
            postId={post.id}
            showCounts={true}
            size="medium"
          />

          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleComments}
              className="flex items-center space-x-1 text-gray-600 hover:text-teal-600 transition-colors duration-200"
            >
              <span>💬</span>
              <span className="text-sm">
                {comments.length > 0 ? `${comments.length} Comments` : 'Comment'}
              </span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-600 hover:text-teal-600 transition-colors duration-200">
              <span>🔄</span>
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
        <div className="space-y-3">
          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isLoadingComment}
            />
            <button
              type="submit"
              disabled={isLoadingComment || !comment.trim()}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingComment ? "..." : "Post"}
            </button>
          </form>

          {/* Comments list */}
          {showComments && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.username)}&background=14b8a6&color=fff&size=24`}
                        alt="Commenter avatar"
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <strong className="font-semibold text-teal-600 text-sm">@{c.username}</strong>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 ml-8 text-sm">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ MAIN: Feed Component with FIXED media persistence
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [postsReactions, setPostsReactions] = useState({});
  const [error, setError] = useState(null);
  
  // ✅ CRITICAL: Use ref to persist posts data across re-renders
  const postsDataRef = useRef([]);
  const fetchCountRef = useRef(0);

  // Fetch current user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    }
  }, []);

  // ✅ ENHANCED: Fetch posts with PERSISTENT data management
  const fetchPosts = useCallback(async () => {
    fetchCountRef.current += 1;
    const fetchId = fetchCountRef.current;
    
    try {
      console.log(`🔄 Fetching posts from API... (Fetch #${fetchId})`);
      const res = await axiosInstance.get("/posts");
      console.log(`📊 API Response (Fetch #${fetchId}):`, res.data);
      
      // ✅ CRITICAL: Merge new data with existing persistent data
      const mergedPosts = res.data.map(newPost => {
        // Find existing post in persistent data
        const existingPost = postsDataRef.current.find(p => p.id === newPost.id);
        
        if (existingPost) {
          // Merge: keep media data if it exists in either version
          return {
            ...newPost,
            photo: newPost.photo || existingPost.photo,
            video: newPost.video || existingPost.video
          };
        }
        
        return newPost;
      });

      // ✅ CRITICAL: Update persistent reference
      postsDataRef.current = mergedPosts;
      
      // ✅ DEBUG: Log each post's media info with persistence tracking
      mergedPosts.forEach((post, index) => {
        const originalPost = res.data[index];
        console.log(`📝 Post ${index + 1} (ID: ${post.id}) - Fetch #${fetchId}:`, {
          username: post.username,
          originalPhoto: originalPost.photo,
          originalVideo: originalPost.video,
          mergedPhoto: post.photo,
          mergedVideo: post.video,
          hasPhoto: !!post.photo,
          hasVideo: !!post.video,
          content: post.content?.substring(0, 50) + '...'
        });
      });

      setPosts(mergedPosts);
      setError(null);
      
      // Fetch reactions for all posts
      if (mergedPosts.length > 0) {
        await fetchPostsReactions(mergedPosts.map(post => post.id));
      }
    } catch (error) {
      console.error(`💥 Error fetching posts (Fetch #${fetchId}):`, error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch reactions for multiple posts
  const fetchPostsReactions = async (postIds) => {
    try {
      const { summary } = await reactionsApi.getReactionsSummary(postIds);
      setPostsReactions(summary);
    } catch (error) {
      console.error("Error fetching posts reactions:", error);
      // Set empty reactions for all posts on error
      const emptyReactions = {};
      postIds.forEach(id => {
        emptyReactions[id] = {
          reactions: {},
          userReaction: null,
          totalReactions: 0
        };
      });
      setPostsReactions(emptyReactions);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ✅ ENHANCED: Handle new post creation with persistent data
  const handlePostCreated = (newPost) => {
    console.log("✅ New post created:", newPost);
    
    // ✅ CRITICAL: Update both state and persistent reference
    const updatedPosts = [newPost, ...posts];
    postsDataRef.current = updatedPosts;
    setPosts(updatedPosts);
    
    // Initialize reactions for new post
    setPostsReactions(prev => ({
      ...prev,
      [newPost.id]: {
        reactions: {},
        userReaction: null,
        totalReactions: 0
      }
    }));
  };

  // Handle reaction selection
  const handleReactionSelect = async (postId, reactionType) => {
    try {
      if (reactionType === null) {
        await reactionsApi.removeReaction(postId);
      } else {
        await reactionsApi.addReaction(postId, reactionType);
      }
      
      // Update reactions for this specific post
      const updatedReactions = await reactionsApi.getReactions(postId);
      setPostsReactions(prev => ({
        ...prev,
        [postId]: updatedReactions
      }));
    } catch (error) {
      console.error("Error handling reaction:", error);
      alert("You must be logged in to react");
    }
  };

  // Filter posts by category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  // ✅ DEBUG: Log current state
  console.log("🔍 Feed State Debug:", {
    postsCount: posts.length,
    persistentPostsCount: postsDataRef.current.length,
    fetchCount: fetchCountRef.current,
    postsWithMedia: posts.filter(p => p.photo || p.video).length,
    persistentPostsWithMedia: postsDataRef.current.filter(p => p.photo || p.video).length
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <span className="ml-3 text-teal-600">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchPosts();
            }}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-teal-400 mb-2">
          🍃 Your Vibes Feed
        </h1>
        <p className="text-teal-800">
          Share your thoughts, find comfort, and grow with your community.
        </p>
      </div>

      {/* New post form */}
      <NewPost onPostCreated={handlePostCreated} />

      {/* Category filter */}
      <Category
        posts={posts}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* ✅ UNIFIED: Posts display with persistent data */}
      <div className="mt-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found.</p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="mt-2 text-teal-600 hover:underline"
              >
                Show all posts
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => {
            const postReactions = postsReactions[post.id] || {
              reactions: {},
              userReaction: null,
              totalReactions: 0
            };

            return (
              <UnifiedPostCard
                key={`post-${post.id}-${fetchCountRef.current}`} // ✅ CRITICAL: Unique key with fetch counter
                post={post}
                postReactions={postReactions}
                onReactionSelect={handleReactionSelect}
              />
            );
          })
        )}
      </div>


                {/*media preview*/}

                {post.photo && (

                  <img 
                  
                    src={`http://localhost:7777/uploads/${post.photo}`}
                    alt="Post"
                    className="mt-3 rounded-lg shadow-sm max-h-80 object-cover" 
                  
                  />

                )}

                {post.video && (

                  <video 
                  
                    src={`http://localhost:7777/uploads/${post.video}`}
                    controls
                    className="mt-3 rounded-lg shadow-sm max-h-80"

                  />

                )}

<div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    {post.is_anonymous ? "Anonymous" : post.username}
                  </span>
                  <Link
                    to={`/profile/${post.user_id}`}
                    className="text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-colors flex items-center gap-1"
                  >
                    View more →
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {/* 👇 FIXED: Pass BOTH userId AND currentUserId */}
                {currentUser && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <FollowList 
                      userId={post.user_id} 
                      currentUserId={currentUser.id} 
                    />
                  </div>
                )}
              </article>
            ))}

      {/* ✅ DEBUG: Development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <strong>Debug Info:</strong> Posts: {posts.length} | 
          Persistent: {postsDataRef.current.length} | 
          Fetches: {fetchCountRef.current} | 
          Media Posts: {posts.filter(p => p.photo || p.video).length}
        </div>
      )}
    </div>
  );
}