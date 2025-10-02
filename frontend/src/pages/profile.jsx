import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import FollowList from "../components/FollowList";
import Badges from "../components/Badges";
import { useParams } from "react-router-dom";
import MentalHealthChart from "../components/MentalHealthChart";
import { FaRegCommentDots, FaTrash } from "react-icons/fa"; // bubble/chat + trash icon
import ProfileUpload from "../components/ProfilePicUpload";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart , setShowChart] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ---------------- Delete Account ----------------
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

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
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-sm border border-gray-100 relative">
      
      {/* ------------------- Delete Button Top Right ------------------- */}
      {currentUser?.id === user?.id && (
        <button
          onClick={() => setShowDeleteForm(!showDeleteForm)}
          className="absolute top-4 right-4 flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <FaTrash />
          Delete
        </button>
      )}

      {/* ------------------- Delete Form ------------------- */}
      {showDeleteForm && (
        <form
          onSubmit={handleRequestDelete}
          className="absolute top-16 right-4 bg-white border border-gray-200 shadow-lg rounded-xl p-4 w-64 z-50"
        >
          <h3 className="text-red-600 font-semibold mb-2 text-center">Delete Account</h3>
          <p className="text-sm mb-2 text-gray-600 text-center">
            Enter your email to receive the deletion link
          </p>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            Send Link
          </button>
          {deleteMessage && (
            <p className="mt-2 text-sm text-center text-gray-700">{deleteMessage}</p>
          )}
        </form>
      )}

      {/* ---------------- Profile Header ---------------- */}
      <div className="text-center pb-8 border-b border-gray-100 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {user?.username || "User"}'s Profile
        </h1>

        {/* Profile picture */}
        {user?.profile_pic ? (
          <img 
            src={`${process.env.REACT_APP_BACKEND_URL}${user.profile_pic}`}
            alt={user.username}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 mx-auto mb-4 shadow-md"
          /> 
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-gray-500 text-2xl font-medium">
            {user?.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        {/* Show upload only if it's the logged-in user's profile */}
        {currentUser?.id === user?.id && (
          <ProfileUpload 
            userId={user.id}
            onUpload={(newPic) => setUser({ ...user, profile_pic: newPic })}
          />
        )}

        {/* Badges */}
        {user?.id && <Badges userId={user.id} />}
      </div>

      {/* AI Analysis Bubble Icon */}
      {user?.id && (
        <button
          onClick={() => setShowChart(!showChart)}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          <FaRegCommentDots size={20} />
          {showChart ? "Hide Analysis" : "Show Analysis"}
        </button>
      )}

      {showChart && (
        <div className="mt-6">
          <MentalHealthChart userId={user.id} />
        </div>
      )}

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
