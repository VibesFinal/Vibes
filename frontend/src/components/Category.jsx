import { useState, useEffect } from "react";
import Post from "./post";

export default function Category({ posts, selectedCategory, setSelectedCategory }) {
  // Default categories
  const defaultCategories = ["Mindfulness", "Self Care", "Anxiety", "Depression"];

  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    // Extract unique categories from posts
    const uniqueCategories = Array.from(new Set(posts.map(p => p.category)));

    // Merge with defaults and deduplicate
    let merged = [...defaultCategories, ...uniqueCategories];
    merged = [...new Set(merged)];

    // Limit to max 6 categories
    setCategories(merged.slice(0, 6));
  }, [posts]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Posts</h2>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 ${
            selectedCategory === ""
              ? "bg-teal-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
          }`}
        >
          All
        </button>

        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 transform hover:-translate-y-0.5 ${
              selectedCategory === cat
                ? "bg-teal-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        posts
          .filter(post => !selectedCategory || post.category === selectedCategory)
          .map(post => <Post key={post.id} post={post} />)
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No posts found.</p>
        </div>
      )}
    </div>
  );
}