import { useState, useEffect } from "react";
import Post from "./post";
import "../styles/post.css";
import "../styles/category.css";

export default function Category({ posts, selectedCategory, setSelectedCategory }) {
  // default categories
  const defaultCategories = ["Mindfulness", "Self Care", "Anxiety", "Depression"];
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    // extract unique categories from posts
    const uniqueCategories = Array.from(new Set(posts.map(p => p.category)));

    // merge with default categories
    let merged = [...defaultCategories, ...uniqueCategories];

    // remove duplicates
    merged = [...new Set(merged)];

    // limit to 6 categories
    setCategories(merged.slice(0, 6));
  }, [posts]);

  return (
    <div className="postsContainer">
      <h2>Posts</h2>

      {/* Category pills bar */}
      <div className="categoryPills">
        <button
          className={`pill ${selectedCategory === "" ? "active" : ""}`}
          onClick={() => setSelectedCategory("")}
        >
          All Posts
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Render posts */}
      {posts.length > 0 ? (
        posts
          .filter(p => !selectedCategory || p.category === selectedCategory)
          .map(post => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
