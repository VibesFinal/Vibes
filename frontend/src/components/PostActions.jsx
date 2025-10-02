import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const PostActions = ({ post, isOwner, onUpdate, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editCategory, setEditCategory] = useState(post.category || "General");
  const [editIsAnonymous, setEditIsAnonymous] = useState(
    post.is_anonymous || false
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Save edited post
  
  const handleEditSave = async () => {
    if (!editContent.trim()) return alert("Content cannot be empty");

    try {
      setIsSaving(true);
      const response = await axiosInstance.put(`/posts/${post.id}`, {
        content: editContent.trim(),
        category: editCategory,
        is_anonymous: editIsAnonymous,
      });

      onUpdate(response.data);
      setIsEditing(false);
      setShowDropdown(false);
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setEditCategory(post.category || "General");
    setEditIsAnonymous(post.is_anonymous || false);
  };

  // Delete post

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/posts/${post.id}`);
      onDelete(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {isOwner && (
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
        >
          &#x22EE;
        </button>
      )}

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 animate-fadeIn">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >

                ✍️ Edit

              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "🗑️ Delete"}
              </button>
            </>
          ) : (
            // Modal
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-5 space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800">Edit Post</h3>

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Update your content..."
                />

                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Anxiety">Anxiety</option>
                    <option value="Depression">Depression</option>
                    <option value="Support">Support</option>
                    <option value="Success Story">Success Story</option>
                    <option value="Question">Question</option>
                    <option value="Advice">Advice</option>
                  </select>
                </div>

                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editIsAnonymous}
                    onChange={(e) => setEditIsAnonymous(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  
                  Post anonymously
                
                </label>

                <div className="flex justify-end gap-2 pt-2">


                  {/* Cancel Button */}
                  
                  <button
                    onClick={handleEditCancel}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
                  
                  >
                    Cancel
                  
                  </button>

                  
                  {/* Save Button */}
                  
                  
                  <button
                  
                    onClick={handleEditSave}
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                      ${
                        isSaving
                          ? "bg-indigo-600 text-black cursor-not-allowed disabled:opacity-100"
                          : "bg-indigo-600 text-black hover:bg-indigo-700"
                      }`}
                  >
                  
                    {isSaving ? "Saving..." : "Save"}
                  
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostActions;
