import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { handleError } from "../utils/alertUtils";
import { FaUserPlus, FaUserMinus, FaUsers } from "react-icons/fa";

export default function FollowList({ userId, currentUserId }) {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchFollowData = async () => {
    try {
      const followersRes = await axiosInstance.get(`/follow/${userId}/followers`);
      setFollowers(followersRes.data);
      setIsFollowing(followersRes.data.some(f => f.id === currentUserId));

      const followingRes = await axiosInstance.get(`/follow/${userId}/following`);
      setFollowing(followingRes.data);
    } catch (err) {
      console.error("Failed to fetch follow data", err);
      handleError(err);
    }
  };

  useEffect(() => {
    fetchFollowData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/follow/${userId}`);
      setIsFollowing(true);
      setFollowers(prev => [...prev, { id: currentUserId }]);
    } catch (err) {
      console.error("Failed to follow", err);
      handleError(err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.delete(`/follow/${userId}`);
      setIsFollowing(false);
      setFollowers(prev => prev.filter(f => f.id !== currentUserId));
    } catch (err) {
      console.error("Failed to unfollow", err);
      handleError(err);
    }
  };

  return (
    <div className="followContainer bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
      {/* Follow / Unfollow Button */}
      {currentUserId !== userId && (
        <div className="text-center mb-6">
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300
              ${isFollowing
                ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400"
                : "bg-gradient-to-r from-[#C05299] to-purple-600 text-white hover:from-[#a04282] hover:to-purple-700"
              }`}
          >
            {isFollowing ? (
              <span className="flex items-center justify-center gap-2">
                <FaUserMinus /> Unfollow
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaUserPlus /> Follow
              </span>
            )}
          </button>
        </div>
      )}

      {/* Followers / Following Stats */}
      <div className="flex items-center justify-around text-center mb-6">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold text-[#C05299] drop-shadow-sm">
            {followers.length}
          </span>
          <span className="text-gray-700 font-medium mt-1">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold text-purple-600 drop-shadow-sm">
            {following.length}
          </span>
          <span className="text-gray-700 font-medium mt-1">Following</span>
        </div>
      </div>

      {/* Followers / Following Lists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Followers */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 shadow-inner border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <FaUsers className="text-[#C05299]" /> Followers
          </h3>
          {followers.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
              {followers.map(f => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 bg-white/70 p-2 rounded-lg hover:bg-white transition-colors duration-200"
                >
                  {f.profile_pic ? (
                    <img
                      src={f.profile_pic}
                      alt={f.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C05299] to-purple-600 flex items-center justify-center text-white font-bold">
                      {f.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="text-gray-700 font-medium">
                    {f.username || `User ${f.id}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">No followers yet</p>
          )}
        </div>

        {/* Following */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 shadow-inner border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <FaUsers className="text-purple-600" /> Following
          </h3>
          {following.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
              {following.map(f => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 bg-white/70 p-2 rounded-lg hover:bg-white transition-colors duration-200"
                >
                  {f.profile_pic ? (
                    <img
                      src={f.profile_pic}
                      alt={f.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {f.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="text-gray-700 font-medium">
                    {f.username || `User ${f.id}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">Not following anyone</p>
          )}
        </div>
      </div>
    </div>
  );
}
