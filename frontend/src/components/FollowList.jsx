// src/components/FollowList.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function FollowList({ userId, currentUserId }) {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchFollowData = async () => {
    try {
      // Fetch followers
      const followersRes = await axiosInstance.get(`/follow/${userId}/followers`);
      setFollowers(followersRes.data);

      // Check if current user is following
      setIsFollowing(followersRes.data.some(f => f.id === currentUserId));

      // Fetch following
      const followingRes = await axiosInstance.get(`/follow/${userId}/following`);
      setFollowing(followingRes.data);
    } catch (err) {
      console.error("Failed to fetch follow data", err);
    }
  };

  useEffect(() => {
    fetchFollowData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/follow/${userId}`);
      setIsFollowing(true);
      setFollowers(prev => [...prev, { id: currentUserId }]); // Add current user
    } catch (err) {
      console.error("Failed to follow", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.delete(`/follow/${userId}`);
      setIsFollowing(false);
      setFollowers(prev => prev.filter(f => f.id !== currentUserId));
    } catch (err) {
      console.error("Failed to unfollow", err);
    }
  };

  return (
    <div className="followContainer">
      {/* Follow / Unfollow Button */}
      {currentUserId !== userId && (
        <button
          className={isFollowing ? "unfollowButton" : "followButton"}
          onClick={isFollowing ? handleUnfollow : handleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      {/* Followers & Following */}
      <p>Followers: {followers.length}</p>
      {/* <ul>
        {followers.map(f => <li key={f.id}>{f.username || `User ${f.id}`}</li>)}
      </ul> */}

      <p>Following: {following.length}</p>
      {/* <ul>
        {following.map(f => <li key={f.id}>{f.username || `User ${f.id}`}</li>)}
      </ul> */}
    </div>
  );
}
