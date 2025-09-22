import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import NewPost from "./newPost";
import { Link } from "react-router-dom";
import FollowList from "../components/FollowList";
import Post from "../components/post";
import InfinitePostList from "../components/InfinitePostList";

//

export default function Feed() {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [newPost , setNewPost] = useState(null);
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


  const handlePostCreated = (post) => {
    setNewPost(post);
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

        <InfinitePostList 
        
          selectedCategory={selectedCategory}
          newPost={newPost}

        />

                           
    </div>  
  );
}