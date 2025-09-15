import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import FollowList from "../components/FollowList";
import { useParams } from "react-router-dom";

export default function Profile() {
  // ✅ FIXED: Use username instead of userId from URL params
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ✅ FIXED: Fetch user profile by username
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(`🔍 Fetching profile for username: ${username}`);
        
        // ✅ FIXED: Use username in API call instead of userId
        const res = await axiosInstance.get(`/profile/${username}`);
        
        console.log("✅ Profile data received:", res.data);
        
        setUser(res.data.user);
        setPosts(res.data.posts);
        setError(null);
      } catch (error) {
        console.error("❌ Profile fetch error:", error.response?.data || error.message);
        
        if (error.response?.status === 404) {
          setError(`User "${username}" not found.`);
        } else {
          setError("Failed to load profile. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }; 
    
    // ✅ FIXED: Check for username instead of userId
    if (username) {
      fetchUserProfile();
    } else {
      console.warn("⚠️ Username is undefined — waiting for route to resolve...");
      setError("Invalid profile URL");
      setLoading(false);
    }
  }, [username]); // ✅ FIXED: Dependency on username instead of userId

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 font-medium text-lg mb-4">❌ {error}</div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ✅ ENHANCED: Better error handling for missing user data
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-600 font-medium text-lg mb-4">User data not available</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* ✅ ENHANCED: Profile Header with better styling */}
      <div className="text-center pb-8 border-b border-gray-100 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          @{user.username}'s Profile
        </h1>

        {/* ✅ ENHANCED: Better avatar display */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-teal-100 mx-auto mb-4 shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        {/* ✅ ENHANCED: Profile info with better styling */}
        <div className="space-y-2">
          <p className="text-gray-600 text-sm md:text-base flex items-center justify-center">
            <span className="mr-2">📧</span>
            {user.email || "Email not provided"}
          </p>
          <p className="text-gray-600 text-sm md:text-base flex items-center justify-center">
            <span className="mr-2">📝</span>
            {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
          </p>
          <p className="text-gray-600 text-sm md:text-base flex items-center justify-center">
            <span className="mr-2">🆔</span>
            User ID: {user.id}
          </p>
        </div>

        {/* ✅ ENHANCED: Show if viewing own profile */}
        {currentUser && currentUser.username === user.username && (
          <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-teal-700 text-sm font-medium">
              👤 This is your profile
            </p>
          </div>
        )}
      </div>

      {/* ✅ ENHANCED: Followers / Following Section with error handling */}
      <div className="mb-8">
        {user.id && currentUser?.id ? (
          <FollowList userId={user.id} currentUserId={currentUser.id} />
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>Follow information not available</p>
          </div>
        )}
      </div>

      {/* ✅ ENHANCED: Posts Section with better empty state */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Posts by @{user.username}
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-500 text-lg mb-2">No posts yet</p>
            <p className="text-gray-400 text-sm">
              {currentUser && currentUser.username === user.username 
                ? "Share your first thought with the community!" 
                : `${user.username} hasn't shared anything yet.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* ✅ DEBUG: Development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <strong>Debug Info:</strong> Username: {username} | 
          User ID: {user?.id} | 
          Posts: {posts.length} | 
          Current User: {currentUser?.username || 'Not logged in'}
        </div>
      )}
    </div>
  );
}