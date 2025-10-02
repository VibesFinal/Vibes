import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import FollowList from "../components/FollowList";
import Badges from "../components/Badges";
import { useParams } from "react-router-dom";
import MentalHealthChart from "../components/MentalHealthChart";
import { FaRegCommentDots } from "react-icons/fa"; // bubble/chat icon
import ProfileUpload from "../components/ProfilePicUpload";



export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart , setShowChart] = useState(false);

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

      {/*Profile picture*/}

        {user?.profile_pic ? (

        <img 
        
          src={`${process.env.REACT_APP_BACKEND_URL}${user.profile_pic}`} // || "http://localhost:7777" put this inside the src if the profile picture didn't appear
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



        {/* ✅ Badges */}
        {user?.id && <Badges userId={user.id} />}
      </div>

      {/* ✅ AI Analysis Bubble Icon */}
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
            {posts.map((post, index) => {
                  if (index === posts.length - 1) {
                    return (
                      <Post
                        key={post.id}
                        post={post}
                        onDelete={(postId) =>
                          setPosts((prev) => prev.filter((p) => p.id !== postId))
                        }
                      />
                    );
                  } else {
                    return (
                      <Post
                        key={post.id}
                        post={post}
                        onDelete={(postId) =>
                          setPosts((prev) => prev.filter((p) => p.id !== postId))
                        }
                      />
                    );
                  }
                })}

      </div>
    </div>
  );
}
