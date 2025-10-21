import { useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { showAlert, handleError } from '../utils/alertUtils';

const categories = ["Mindfulness", "Self Care", "Anxiety", "Depression", "Positive Vibes"];

export default function NewPost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [user , setUser] = useState(null);

  const suggestionsRef = useRef(null);

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

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCategoryInput(cat);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !categoryInput.trim())
      return showAlert("Post and category cannot be empty");

    setIsPosting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("category", selectedCategory || categoryInput);
      formData.append("is_anonymous", isAnonymous);
      if (photo) formData.append("photo", photo);
      if (video) formData.append("video", video);

      const res = await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent("");
      setCategoryInput("");
      setSelectedCategory("");
      setIsAnonymous(false);
      setPhoto(null);
      setVideo(null);
      onPostCreated && onPostCreated(res.data);

    } catch (err) {
      console.error("Error creating post:", err);
      showAlert("You must be logged in to create a post");
      handleError(err);
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {

      try {        
        const res = await axiosInstance.get("/user/profile");
        setUser(res.data.user);
      } catch (error) {
        console.error("error fetching user" , error);
        handleError(error);       
      }
    }

    fetchUser();

  } , []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Main Content Area */}
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user?.profile_pic ? (
            <img
              src={user.profile_pic}
              alt={user.username || "Profile"}
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          )}
        </div>


        {/* Input Area */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts or feelings..."
            rows="2"
            className={`w-full text-base text-gray-700 bg-white border rounded-xl px-4 py-2 placeholder:text-gray-400 resize-none mb-3
    focus:outline-none focus:ring-2 focus:ring-[#C05299]/30 focus:border-[#C05299]`}
          />

          
          <div className="relative mb-4" ref={suggestionsRef}>
              {/* Category Input */}
              <input
                value={categoryInput}
                onChange={handleCategoryChange}
                placeholder="Category (e.g., Mindfulness, Self Care...)"
                className={`w-full text-sm bg-gray-50 border rounded-xl px-4 py-2 text-gray-700 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#C05299]/30 focus:border-[#C05299]`}
              />
            {suggestions.length > 0 && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                {suggestions.map((cat, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectCategory(cat)}
                    className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-purple-50"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Preview */}
          {(photo || video) && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
              {photo && <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full object-cover max-h-48" />}
              {video && <video controls src={URL.createObjectURL(video)} className="w-full max-h-48" />}
            </div>
          )}

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Photo Button */}
              <label className="flex items-center gap-2 text-gray-500 hover:text-[#C05299] cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span className="text-sm font-medium">Photo</span>
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="hidden" />
              </label>

              {/* Video Button */}
              <label className="flex items-center gap-2 text-gray-500 hover:text-[#C05299] cursor-pointer transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span className="text-sm font-medium">Video</span>
                <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="hidden" />
              </label>


            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-600">Anonymous</span>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-[#C05299] w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Post Button */}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isPosting}
          className={`px-8 py-2.5 rounded-full font-semibold text-white text-sm transition-all ${
            isPosting
              ? "bg-gray-300 cursor-not-allowed"
               : "bg-[#C05299] hover:shadow-lg hover:scale-105"
          }`}
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}