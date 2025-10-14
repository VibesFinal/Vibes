import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ReactionButton from "./Reactions";
import PostActions from "./PostActions";

const Post = forwardRef(({ post, onDelete }, ref) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [reactionType, setReactionType] = useState(null);
  const [reactionCount, setReactionCount] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [localPost, setLocalPost] = useState(post);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setCurrentUserId(Number(res.data.user.id));
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchReactions();
  }, []);

  const fetchReactions = async () => {
    try {
      const res = await axiosInstance.get(`/likes/like/${post.id}`);
      setReactionType(res.data.reactionType);
      setReactionCount(res.data.counts || {});
      setLikedByUser(res.data.likedByUser);
      setLikes(Object.values(res.data.counts || {}).reduce((a, b) => a + b, 0));
    } catch (error) {
      console.error("error fetching reactions", error);
    }
  };

  const handleReaction = async (type) => {
    try {
      if (type === reactionType) {
        await axiosInstance.delete(`/likes/like/${post.id}`);
      } else {
        await axiosInstance.post(`/likes/like/${post.id}`, {
          reaction_type: type,
        });
      }
      fetchReactions();
    } catch (error) {
      console.error("error reacting", error);
      alert("you must be logged in to react");
    }
  };

  const handleLike = async () => {
    try {
      if (likedByUser) {
        await axiosInstance.delete(`/likes/like/${post.id}`);
        setLikes((prev) => prev - 1);
      } else {
        await axiosInstance.post(`/likes/like/${post.id}`);
        setLikes((prev) => prev + 1);
      }
      setLikedByUser(!likedByUser);
    } catch (error) {
      console.error("like error", error);
      alert("you must be logged in to like");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${post.id}`);
      setComments(res.data);
    } catch (error) {
      console.error("error fetching comments", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("comment cannot be empty");
    try {
      await axiosInstance.post(`/comments/${post.id}`, { content: comment });
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("error adding a comment", error);
      alert("you must be logged in to comment");
    }
  };

  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  const goToProfile = () => {
    if (!localPost.is_anonymous && localPost.username) {
      navigate(`/profile/${localPost.username}`);
    }
  };

  const isOwner =
    currentUserId !== null &&
    Number(localPost.user_id) === Number(currentUserId);

  const isTherapist = localPost.is_therapist === true || localPost.is_therapist === "t";

  // Updated category color mapping
  const getCategoryStyle = (category) => {
    const styles = {
      "Mindfulness": "bg-[#C05299]/20 text-[#C05299] border-[#C05299]",
      "Self Care": "bg-[#C05299]/20 text-[#C05299] border-[#C05299]",
      "Anxiety": "bg-[#C05299]/20 text-[#C05299] border-[#C05299]",
      "Depression": "bg-[#C05299]/20 text-[#C05299] border-[#C05299]",
      "Positive Vibes": "bg-[#C05299]/20 text-[#C05299] border-[#C05299]",
    };
    return styles[category] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div ref={ref} className="mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300">

        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div
              className="flex items-center gap-3 cursor-pointer group flex-1"
              onClick={goToProfile}
            >
              {/* Profile Picture */}
              {localPost.is_anonymous ? (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-semibold shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : localPost.profile_pic ? (
                <img
                  src={localPost.profile_pic}
                  alt={localPost.username || "User"}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 group-hover:border-[#C05299] transition-colors shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {localPost.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              {/* Username + Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-[#C05299] transition-colors truncate">
                    {localPost.is_anonymous ? "Anonymous" : localPost.username}
                  </h3>

                  {!localPost.is_anonymous && isTherapist && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white rounded-full text-xs font-semibold shadow-sm">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Therapist
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <small className="text-xs text-slate-500">
                    {new Date(localPost.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                  {localPost.category && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getCategoryStyle(localPost.category)}`}>
                        {localPost.category}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <PostActions
              post={localPost}
              isOwner={isOwner}
              onUpdate={(updatedPost) => setLocalPost(updatedPost)}
              onDelete={onDelete}
            />
          </div>

          {/* Content */}
          <div className="mt-3">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {localPost.content}
            </p>
          </div>
        </div>

        {/* Media */}
        {(localPost.photo || localPost.video) && (
          <div className="px-5">
            {localPost.photo && (
              <img
                src={localPost.photo}
                alt="Post"
                className="rounded-xl w-full object-contain max-h-96 border border-slate-200 bg-slate-50"
              />
            )}
            {localPost.video && (
              <video
                src={localPost.video}
                controls
                className="rounded-xl w-full max-h-96 border border-slate-200"
              />
            )}
          </div>
        )}

        {/* Reactions */}
        <div className="px-5 py-3 border-t border-slate-100">
          <ReactionButton
            reactionType={reactionType}
            reactionCount={reactionCount}
            handleReaction={handleReaction}
          />
        </div>

        {/* Comments */}
        <div className="px-5 pb-4 border-t border-slate-100">
          <form onSubmit={handleCommentSubmit} className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#C05299]/30 focus:border-[#C05299] transition-all"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#C05299] to-[#D473B3] text-white rounded-xl font-medium text-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>

          <button
            onClick={toggleComments}
            className="mt-3 flex items-center gap-2 text-sm text-[#C05299] hover:text-[#D473B3] font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {showComments ? "Hide comments" : `View comments ${comments.length > 0 ? `(${comments.length})` : ""}`}
          </button>

          {showComments && (
            <div className="mt-4 space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div
                      className="cursor-pointer flex-shrink-0"
                      onClick={() => navigate(`/profile/${c.username}`)}
                    >
                      {c.profile_pic ? (
                        <img
                          src={c.profile_pic}
                          alt={c.username || "User"}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C05299] to-[#D473B3] flex items-center justify-center text-white text-sm font-semibold">
                          {c.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span
                          onClick={() => navigate(`/profile/${c.username}`)}
                          className="text-sm font-semibold text-slate-800 cursor-pointer hover:text-[#C05299] transition-colors"
                        >
                          {c.username}
                        </span>
                        {c.created_at && (
                          <span className="text-xs text-slate-400">
                            {new Date(c.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed break-words">
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Post;
