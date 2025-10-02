import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ReactionButton from "./Reactions";
import PostActions from "./PostActions";
import "../styles/post.css";

const Post = forwardRef(({ post ,onDelete }, ref) => {

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [reactionType, setReactionType] = useState(null);
  const [reactionCount, setReactionCount] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [localPost, setLocalPost] = useState(post);

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


  const navigate = useNavigate();

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

  return (
<div ref={ref} className="outerCard">
<div className="postCard p-4 space-y-3">
        {/* Header with username, profile picture, and actions */}
<div className="flex items-center justify-between">
<div
            className="flex items-center gap-3 cursor-pointer"
            onClick={goToProfile}
>
            {/* Profile picture */}
<img
              src={
                localPost.is_anonymous
                  ? "https://via.placeholder.com/40"
                  : `${process.env.REACT_APP_BACKEND_URL}${localPost.profile_pic}`
              }
              alt={localPost.username || "Anonymous"}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />

        {/* Username */}
<h3 className="profileNameLink text-lg font-semibold">
          {localPost.is_anonymous ? "Anonymous" : localPost.username}
</h3>

</div>


          {/* Post actions */}
<PostActions
            post={localPost}
            isOwner={isOwner}
            onUpdate={(updatedPost) => setLocalPost(updatedPost)}
            onDelete={onDelete} 
/></div>

        {/* Post content */}
<div className="space-y-1">
<p>{localPost.content}</p>
<p className="text-sm text-gray-500">
            {localPost.category || "General"}
</p>
<small className="text-gray-400">
            {new Date(localPost.created_at).toLocaleString()}
</small>
</div>

        {/* Media preview */}
<div className="mt-3 flex justify-center gap-3">
          {localPost.photo && (
<img
              src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${localPost.photo}`}
              alt="Post"
              className="mt-3 rounded-lg shadow-sm max-h-80 object-cover"
            />
          )}
          {localPost.video && (
<video
              src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${localPost.video}`}
              controls
              className="mt-3 rounded-lg shadow-sm max-h-80"
            />
          )}
</div>

        {/* Reactions */}
<ReactionButton
          reactionType={reactionType}
          reactionCount={reactionCount}
          handleReaction={handleReaction}
        />

        {/* Comment form */}
<div className="mt-3">
<form onSubmit={handleCommentSubmit} className="flex gap-2">
<input
              type="text"
              placeholder="Write your opinion"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1"
            />
<button
              type="submit"
              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
>
              Comment
</button>
</form>
</div>

        {/* Comments toggle */}
<button
          onClick={toggleComments}
          className="mt-2 text-sm text-blue-500 hover:underline"
>
          {showComments ? "Hide comments" : "View comments"}
</button>

        {/* Comments list */}
        {showComments &&
          comments.map((c) => (
<p key={c.id} className="pl-12 text-sm">
        <strong>@{c.username}:</strong> {c.content}
              </p>
             ))}
         </div>
        </div>
       );
    });

export default Post;