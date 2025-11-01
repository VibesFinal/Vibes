import { useState, useEffect } from "react";
import NewPost from "./newPost";
import InfinitePostList from "../components/InfinitePostList";
import { showAlert, handleError } from '../utils/alertUtils';
import WelcomeModal from "../components/welcomeModal";

export default function Feed() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newPost, setNewPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          console.error("Failed to parse user from localStorage");
          handleError("Failed to load user data. Please log in again.");
        }
      }
    }
  }, []);

  const handlePostCreated = (post) => setNewPost(post);

  const categories = [
    { name: "Mindfulness",  gradient: "from-emerald-400 to-teal-500" },
    { name: "Self Care",  gradient: "from-pink-400 to-rose-500" },
    { name: "Anxiety",  gradient: "from-blue-400 to-cyan-500" },
    { name: "Depression",  gradient: "from-indigo-400 to-purple-500" },
    { name: "Positive Vibes",  gradient: "from-amber-400 to-orange-500" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative">

      <WelcomeModal />
      
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Glassmorphic Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-[80px] space-y-4">
              
              {/* Category Pills */}
              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-from-[#C05299] to-[#D473B3] shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9333EA] to-[#C05299] flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Explore</h3>
                    <p className="text-xs text-slate-500">Find your vibe</p>
                  </div>
                </div>

                <div className="space-y-3">
                    {/* All Posts Button */}
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`group w-full text-left px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        selectedCategory === ""
                          ? "bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white shadow-xl scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 hover:scale-105"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>All Posts</span>
                      </div>
                    </button>

                    {/* Category Buttons */}
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`group w-full text-left px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                          selectedCategory === cat.name
                            ? "bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white shadow-xl scale-105"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 hover:scale-105"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span>{cat.name}</span>
                        </div>
                      </button>
                    ))}

                </div>
              </div>

              {/* Active Filter Indicator */}
              {selectedCategory && (
                <div className="bg-gradient-to-r from-purple-200/50 to-pink-200/50 backdrop-blur-2xl rounded-3xl p-1 border border-purple-300/50 mt-4">
                  <div className="bg-white/90 rounded-3xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">

                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Filtering</p>
                          <p className="text-slate-800 font-bold">{selectedCategory}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="w-8 h-8 rounded-xl bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* New Post Card */}
            <div className="group bg-white/80 backdrop-blur-2xl rounded-3xl border border-purple-200/50 shadow-xl overflow-hidden hover:bg-white/90 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Share Your Vibes</h2>
                    <p className="text-slate-500 text-sm">What's on your mind today?</p>
                  </div>
                </div>
                <NewPost onPostCreated={handlePostCreated} />
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedCategory ? `${selectedCategory} Feed` : "Latest Posts"}
                </h2>
              </div>
              
              <div className="space-y-4">
                <InfinitePostList selectedCategory={selectedCategory} newPost={newPost} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}