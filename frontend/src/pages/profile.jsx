import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import FollowList from "../components/FollowList";
import { useParams } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get(`/profile/${username}`);
      setUser(res.data.user);
      setPosts(res.data.posts);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="profileContainer">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profileContainer">
        <div className="error">❌ {error}</div>
      </div>
    );
  }

  return (
    <div className="profileContainer">
      {/* User Profile Header */}
      <div className="profileHeader">
        <h2>{user?.username || "User"}'s Profile</h2>
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={user.username}
            className="profileAvatar"
          />
        )}
        <p>Email: {user?.email || "Not provided"}</p>
        <p>Total Posts: {posts.length}</p>

        {/* Followers / Following Section */}
        <FollowList userId={user.id} currentUserId={currentUser.id} />
      </div>

      {/* Posts Section */}
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}
