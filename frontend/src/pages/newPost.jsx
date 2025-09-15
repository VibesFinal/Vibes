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
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);


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
   
      const formData = new FormData();

        formData.append("content" , content);
        formData.append("category" , selectedCategory || categoryInput);
        formData.append("is_anonymous" , isAnonymous);

        if(photo) formData.append("photo" , photo);
        if(video) formData.append("video" , video);

      const res = await axiosInstance.post("/posts", formData, {

          headers: { "Content-Type": "multipart/form-data" },

      });


      const createdPost = res.data;

      // Clear input fields
      setContent("");
      setCategoryInput("");
      setSelectedCategory("");
      setIsAnonymous(false);
      //

      setVideo(null);
      setPhoto(null);
      

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
        className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 resize-none"
      />

      {/* Category Input + Suggestions Dropdown */}
      <div className="relative mt-4" ref={suggestionsRef}>
        <textarea
          value={categoryInput}
          onChange={handleCategoryChange}
          placeholder="Type or select a category"
          rows="1"
          className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 resize-none"
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


{/* Media Upload Section */}
<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

  {/* Photo Upload */}

  <div className="flex flex-col items-center justify-center w-sm">

    <label className="w-full flex flex-col items-center px-2 py-4 bg-gray-50 text-gray-700 rounded-lg border-4 border-dashed border-gray-300 cursor-pointer hover:bg-teal-50 hover:border-teal-400 transition-colors duration-200">

      <svg

        className="w-8 h-8 mb-2 text-teal-500"
 

        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"

      >
        <path

          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 010 10H7z"

        />

      </svg>

      <span className="font-medium text-sm">Upload Photo</span>

      <input

        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        className="hidden"

      />

    </label>

    {photo && (

      <p className="mt-2 text-sm text-gray-600">
        📷 {photo.name}
      </p>

    )}
    
  </div>

  {/* Video Upload */}

  <div className="flex flex-col items-center justify-center w-full">

 
    <label className="w-full flex flex-col items-center px-2 py-4 bg-gray-50 text-gray-700 rounded-lg border-4 border-dashed border-gray-300 cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-colors duration-200">

      <svg

        className="w-8 h-8 mb-2 text-teal-500"

        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"

      >
        <path

          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14.752 11.168l-4.586-2.657A1 1 0 009 9.342v5.316a1 1 0 001.166.95l4.586-2.657a1 1 0 000-1.732z"

        />
        <path

          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"

        />

      </svg>

      <span className="font-medium text-sm">Upload Video</span>

      <input

        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
        className="hidden"

      />

    </label>

    {video && (

      <p className="mt-2 text-sm text-gray-600">
        🎥 {video.name}
      </p>

    )}

  </div>

</div>


      {video && <p>Selected video: {video.name}</p>}


      {/* Submit Button */}
      <button
        type="submit"
        className="mt-5 w-full bg-teal-700 text-white font-medium py-3 rounded-lg hover:bg-teal-500 transform transition-all duration-150 hover:-translate-y-0.5 active:scale-95 shadow-sm"
      >
        Post
      </button>

      {/* Anonymous Checkbox */}
      <label className="flex items-center mt-2 text-xsm text-teal-700">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className=" mt-1 mr-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded checked:bg-teal-600"
        />
        Anonymous🙈
      </label>
    </form>
  );
}