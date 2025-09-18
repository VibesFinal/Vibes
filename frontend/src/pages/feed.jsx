import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import NewPost from "./newPost";
import { Link } from "react-router-dom";
import FollowList from "../components/FollowList";
import Post from "../components/post";

export default function Feed() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // 👈 NEW STATE

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

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      console.log("📊 Raw posts from API:", res.data);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Skeleton loader for posts
  const SkeletonPost = () => (
    <div className="bg-gray-50 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          🌿 Your Vibes Feed
        </h1>
        <p className="text-gray-600 text-lg">Share your thoughts, find comfort, and grow together</p>
      </div>

      {/* New Post Form */}
      <div className="mb-8">
        <NewPost onPostCreated={handlePostCreated} />
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === ""
              ? "bg-cyan-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Posts
        </button>
        {["Mindfulness", "Self Care", "Anxiety", "Depression", "Positive Vibes"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
              selectedCategory === cat
                ? "bg-cyan-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            ></path>
          </svg>
          <h3 className="text-gray-500 text-xl font-medium">No posts yet</h3>
          <p className="text-gray-400 mt-2">Be the first to share your vibe!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts
            .filter(
              (post) =>
                !selectedCategory || post.category === selectedCategory
            )
            .map((post) => (
            
              <Post key={post.id} post={post}/>

            ))}
        </div>
      )}
    </div>
  );
}