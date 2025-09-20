import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import FollowList from "../components/FollowList";
import Badges from "../components/Badges";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axiosInstance.get(`/profile/username/${username}`);
        setUser(res.data.user);
        setPosts(res.data.posts);
        setError(null);
      } catch (error) {
        console.error("❌ Axios Error:", error.response?.data || error.message);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUserProfile();
    else setLoading(false);
  }, [username]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Profile Header */}
      <div className="text-center pb-8 border-b border-gray-100 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {user?.username || "User"}'s Profile
        </h1>

        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 mx-auto mb-4 shadow-md"
          />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-gray-500 text-2xl font-medium">
            {user?.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        <p className="text-gray-600 text-sm md:text-base mb-1">📧 {user?.email || "Not provided"}</p>
        <p className="text-gray-600 text-sm md:text-base">📝 Total Posts: {posts.length}</p>

        {/* ✅ Badges */}
        {user?.id && <Badges userId={user.id} />}
      </div>

      {/* Followers / Following Section */}
      <div className="mb-8">
        <FollowList userId={user?.id} currentUserId={currentUser?.id} />
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
