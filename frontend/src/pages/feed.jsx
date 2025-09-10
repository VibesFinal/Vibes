import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import NewPost from "./newPost";
import Category from "../components/Category";
import "../styles/feed.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("error fetching the posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="feedPage">
      <h2>Feed</h2>

      {/* ✅ New post form here */}
      <NewPost onPostCreated={handlePostCreated} />

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <Category
          posts={posts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </div>
  );
}  