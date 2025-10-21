import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { showAlert, handleError } from '../utils/alertUtils';

const CreateCommunity = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🌱',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || formData.tags.length === 0) {
      setError('Please fill all fields and add at least one tag.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/communities', formData);
      showAlert('Community created successfully!');
      navigate('/community');
    } catch (err) {
      console.error(err);
      setError('Failed to create community. Please try again.');
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Floating blobs (matches other pages) */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 -left-16 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 -right-16 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-4 bg-[#C05299]/10 rounded-full blur-lg"></div>
            <h1 className="relative text-4xl font-bold bg-gradient-to-r from-[#C05299] to-[#D473B3] bg-clip-text text-transparent">
              Create Your Support Circle
            </h1>
          </div>
          <p className="text-[#64748b] text-lg max-w-md mx-auto">
            Build a safe space for meaningful conversations and mutual support
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-[#e9d5ff]/50 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C05299] to-[#D473B3]"></div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Community Name */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#1e293b]">Community Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-[#e9d5ff] rounded-2xl focus:outline-none focus:border-[#C05299]/50 focus:ring-3 focus:ring-[#C05299]/20 transition-all duration-300 placeholder:text-[#64748b]/60 text-[#1e293b] shadow-lg hover:shadow-xl"
                  placeholder="e.g., Anxiety Support Group"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#C05299]/60">
                  🏷️
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#1e293b]">Description</label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-[#e9d5ff] rounded-2xl focus:outline-none focus:border-[#C05299]/50 focus:ring-3 focus:ring-[#C05299]/20 transition-all duration-300 placeholder:text-[#64748b]/60 text-[#1e293b] shadow-lg hover:shadow-xl resize-none"
                  placeholder="Describe what this community is about, its purpose, and who it's for..."
                  required
                />
                <div className="absolute right-4 top-4 text-[#C05299]/60">
                  📝
                </div>
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#1e293b]">Community Icon</label>
              <div className="relative">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-[#e9d5ff] rounded-2xl focus:outline-none focus:border-[#C05299]/50 focus:ring-3 focus:ring-[#C05299]/20 transition-all duration-300 placeholder:text-[#64748b]/60 text-[#1e293b] shadow-lg hover:shadow-xl text-center text-2xl"
                  placeholder="Choose an emoji..."
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C05299]/60 text-lg">
                  🎨
                </div>
              </div>
              <p className="text-xs text-[#64748b]/70">Popular choices: 🌱 💬 🧘 🌈 💛 🕊️</p>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#1e293b]">Tags & Topics</label>

              {/* Tag Input */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full px-5 py-3 bg-white/90 backdrop-blur-sm border-2 border-[#e9d5ff] rounded-2xl focus:outline-none focus:border-[#C05299]/50 focus:ring-3 focus:ring-[#C05299]/20 transition-all duration-300 placeholder:text-[#64748b]/60 text-[#1e293b] shadow-lg"
                    placeholder="Add a topic tag (e.g., anxiety, mindfulness)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-6 py-3 bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] text-white font-medium rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-[#e9d5ff]/50 whitespace-nowrap"
                >
                  Add
                </button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gradient-to-r from-[#f5f3ff] to-[#fdf2f8] text-[#C05299] px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 border border-[#e9d5ff] shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <span className="text-[#C05299]/80">#</span>
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-[#C05299]/70 hover:text-[#9333EA] transition-colors duration-200 group-hover:scale-110"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {formData.tags.length === 0 && (
                <p className="text-xs text-[#64748b]/70 italic">
                  Add tags to help people find your community
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#C05299] to-[#D473B3] hover:from-[#9333EA] hover:to-[#C05299] disabled:from-gray-200 disabled:to-gray-300 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Your Circle...
                  </>
                ) : (
                  <>
                    <span className="group-hover:scale-110 transition-transform duration-300">🌱</span>
                    Create Support Circle
                    <span className="group-hover:scale-110 transition-transform duration-300">✨</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate('/community')}
              className="text-[#C05299] hover:text-[#9333EA] font-medium flex items-center justify-center gap-2 group transition-all duration-300 hover:-translate-x-1"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Communities
            </button>
          </div>
        </div>
      </div>

      {/* Reuse blob animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default CreateCommunity;