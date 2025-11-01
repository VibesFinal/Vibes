import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import FollowList from "../components/FollowList";
import Badges from "../components/Badges";
import { useParams } from "react-router-dom";
import MentalHealthChart from "../components/MentalHealthChart";
import { FaRegCommentDots, FaTrash, FaChartLine, FaTimes, FaChevronDown, FaUserFriends, FaTrophy, FaNewspaper, FaCog } from "react-icons/fa";
import ProfileUpload from "../components/ProfilePicUpload";
import InfinitePostList from "../components/InfinitePostList";
import { handleError } from "../utils/alertUtils";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ---------------- Delete Account ----------------
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  // ---------------- Dropdown States ----------------
  const [showAnalysisDropdown, setShowAnalysisDropdown] = useState(false);
  const [showConnectionsDropdown, setShowConnectionsDropdown] = useState(false);
  const [showBadgesDropdown, setShowBadgesDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleRequestDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/user/request-delete", {
        email: deleteEmail.trim().toLowerCase(),
      });
      setDeleteMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setDeleteMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  // ---------------- Fetch Profile ----------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axiosInstance.get(`/profile/username/${username}`);
        setUser(res.data.user);
        setPosts(res.data.posts);
        setError(null);
      } catch (error) {
        console.error("❌ Axios Error:", error.response?.data || error.message);
        handleError(error);
        setError(error.response?.data?.message || "Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchUserProfile();
    else setLoading(false);
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#C05299] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-purple-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-red-100">
          <div className="text-6xl mb-4 text-center">😔</div>
          <p className="text-red-600 text-center font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header Card */}
        <div className="relative bg-gradient-to-br from-[#C05299] via-purple-600 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden mb-6">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          </div>

          {/* Settings Dropdown (Top Right) */}
          {currentUser?.id === user?.id && (
            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <FaCog className="text-lg" />
                <span className="font-medium hidden sm:inline">Settings</span>
                <FaChevronDown className={`text-xs transition-transform duration-300 ${showSettingsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSettingsDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setShowDeleteForm(true);
                      setShowSettingsDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-red-600 font-medium"
                  >
                    <FaTrash />
                    <span>Delete Account</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Delete Form Modal */}
          {showDeleteForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-300">
                <button
                  onClick={() => {
                    setShowDeleteForm(false);
                    setDeleteMessage("");
                    setDeleteEmail("");
                  }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={24} />
                </button>

                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FaTrash className="text-white text-3xl" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3">Delete Account</h3>
                  <p className="text-gray-600">
                    This action is permanent. Enter your email to receive a confirmation link.
                  </p>
                </div>

                <form onSubmit={handleRequestDelete} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-gray-700"
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Send Deletion Link
                  </button>
                  {deleteMessage && (
                    <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${
                      deleteMessage.toLowerCase().includes('error') || deleteMessage.toLowerCase().includes('wrong')
                        ? 'bg-red-50 text-red-700 border-2 border-red-200'
                        : 'bg-green-50 text-green-700 border-2 border-green-200'
                    }`}>
                      {deleteMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Profile Header Content */}
          <div className="relative z-10 text-center py-12 px-6">
            {/* Profile Picture with Ring Animation */}
            <div className="mb-6 relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              {user?.profile_pic ? (
                <img
                  src={user.profile_pic}
                  alt={user.username}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/90 backdrop-blur-md border-4 border-white flex items-center justify-center text-[#C05299] text-5xl font-bold shadow-2xl">
                  {user?.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}

              {/* Therapist Badge Overlay */}
              {user?.is_therapist && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-5 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 border-3 border-white animate-pulse">
                    <span className="text-base">✓</span>
                    <span className="tracking-wide">CERTIFIED THERAPIST</span>
                  </div>
                </div>
              )}
            </div>

            {/* Username with Gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 drop-shadow-2xl tracking-tight">
              {user?.username || "User"}
            </h1>

            {/* Upload Button for Current User */}
            {currentUser?.id === user?.id && (
              <div className="mt-6 inline-block">
                <ProfileUpload
                  userId={user.id}
                  onUpload={(newPic) => setUser({ ...user, profile_pic: newPic })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar - Dropdowns */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Achievements Dropdown */}
            {user?.id && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                <button
                  onClick={() => setShowBadgesDropdown(!showBadgesDropdown)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-[#C05299]/5 hover:to-purple-500/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C05299] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaTrophy className="text-white text-lg" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Achievements</span>
                  </div>
                  <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${showBadgesDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showBadgesDropdown && (
                  <div className="p-5 pt-0 animate-in slide-in-from-top-2 duration-200">
                    <Badges userId={user.id} />
                  </div>
                )}
              </div>
            )}

            {/* AI Analysis Dropdown */}
            {user?.id && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                <button
                  onClick={() => setShowAnalysisDropdown(!showAnalysisDropdown)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-[#C05299]/5 hover:to-purple-500/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaChartLine className="text-white text-lg" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">AI Analysis</span>
                  </div>
                  <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${showAnalysisDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showAnalysisDropdown && (
                  <div className="p-5 pt-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 animate-in slide-in-from-top-2 duration-200">
                    <MentalHealthChart userId={user.id} />
                  </div>
                )}
              </div>
            )}

            {/* Connections Dropdown */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <button
                onClick={() => setShowConnectionsDropdown(!showConnectionsDropdown)}
                className="w-full flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-[#C05299]/5 hover:to-purple-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-[#C05299] rounded-xl flex items-center justify-center shadow-lg">
                    <FaUserFriends className="text-white text-lg" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Connections</span>
                </div>
                <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${showConnectionsDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showConnectionsDropdown && (
                <div className="p-5 pt-0 animate-in slide-in-from-top-2 duration-200">
                  <FollowList userId={user?.id} currentUserId={currentUser?.id} />
                </div>
              )}
            </div>

          </div>

          {/* Right Side - Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#C05299]/5 to-purple-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#C05299] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaNewspaper className="text-white text-lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
                </div>
              </div>
              <div className="p-6">
                <InfinitePostList username={username} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}