import { useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

// Default categories for suggestions
const categories = ["Mindfulness", "Self Care", "Anxiety", "Depression", "Positive Vibes"];

export default function NewPost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const suggestionsRef = useRef(null);

  // Handle input change and filter suggestions
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);
    setSelectedCategory("");
    setSuggestions(
      categories.filter((cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Handle selection from suggestions
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCategoryInput(cat);
    setSuggestions([]);
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || !categoryInput.trim()) {
      return alert("Post and category cannot be empty");
    }

    try {
      const payload = {
        content,
        category: selectedCategory || categoryInput,
        is_anonymous: isAnonymous,
      };

      const res = await axiosInstance.post("/posts", payload);
      const createdPost = res.data;

      // Clear input fields
      setContent("");
      setCategoryInput("");
      setSelectedCategory("");
      setIsAnonymous(false);

      // Notify parent component about the new post
      if (onPostCreated) onPostCreated(createdPost);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("You must be logged in to create a post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 w-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      {/* Main Post Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows="3"
        className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 resize-none"
      />

      {/* Category Input + Suggestions Dropdown */}
      <div className="relative mt-4" ref={suggestionsRef}>
        <textarea
          value={categoryInput}
          onChange={handleCategoryChange}
          placeholder="Type or select a category"
          rows="1"
          className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 resize-none"
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-cyan-300 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100">
            {suggestions.map((cat, index) => (
              <li
                key={index}
                onClick={() => handleSelectCategory(cat)}
                className="px-4 py-3 cursor-pointer hover:bg-cyan-50 text-gray-800 font-medium transition-colors duration-150"
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-5 w-full bg-cyan-600 text-white font-medium py-3 rounded-lg hover:bg-cyan-700 transform transition-all duration-150 hover:-translate-y-0.5 active:scale-95 shadow-sm"
      >
        Post
      </button>

      {/* Anonymous Checkbox */}
      <label className="flex items-center mt-4 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="mr-2 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
        />
        Post anonymously
      </label>
    </form>
  );
}