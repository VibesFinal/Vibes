import { useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/newPost.css";

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
        category: selectedCategory || categoryInput, // fallback if user typed a new category
        is_anonymous: isAnonymous // <<< ADD THIS LINE
      };

      const res = await axiosInstance.post("/posts", payload);
      const createdPost = res.data;

      // Clear input fields
      setContent("");
      setCategoryInput("");
      setSelectedCategory("");
      setIsAnonymous(false); // <<< to reset the checkbox

      // Notify parent component about the new post
      if (onPostCreated) onPostCreated(createdPost);

    } catch (error) {
      console.error("Error creating post:", error);
      alert("You must be logged in to create a post");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="newPostForm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows="3"
      />

      <div style={{ position: "relative", marginBottom: "10px" }} ref={suggestionsRef}>
        <textarea
          type="text"
          value={categoryInput}
          onChange={handleCategoryChange}
          placeholder="Type or select a category"
          rows="1"
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              border: "1px solid #188585",
              position: "absolute",
              width: "100%",
              background: "white",       
              fontWeight: 500,       
              zIndex: 10,
              borderRadius: "20px",
              maxHeight: "150px",
              overflowY: "auto",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
            }}
          >
            {suggestions.map((cat, index) => (
              <li
                key={index}
                onClick={() => handleSelectCategory(cat)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #188585",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#ddd")}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ddd";
                  e.target.style.color = "#188585";
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit">Post</button>
      <label className="anonymous-checkbox">
    <input
        type="checkbox"
        checked={isAnonymous}
        onChange={(e) => setIsAnonymous(e.target.checked)}
    />
    Post anonymously
</label>

    </form>
    
  );
}
