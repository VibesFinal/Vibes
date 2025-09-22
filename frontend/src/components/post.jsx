import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ReactionButton from "./Reactions";
import "../styles/post.css";

const Post = forwardRef(({ post }, ref) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [reactionType, setReactionType] = useState(null);
  const [reactionCount, setReactionCount] = useState({});

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
        await axiosInstance.post(`/likes/like/${post.id}`, { reaction_type: type });
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
    if (!post.is_anonymous && post.username) {
      navigate(`/profile/${post.username}`);
    }
  };

  return (
    <div ref={ref} className="outerCard">
      <div className="postCard">
        {/* Username */}
        <h3 onClick={goToProfile} className="profileNameLink">
          @{post.is_anonymous ? "Anonymous" : post.username}
        </h3>

        {/* Post content */}
        <p>{post.content}</p>
        <p>{post.category || "General"}</p>
        <small>{new Date(post.created_at).toLocaleString()}</small>

        {/* Media preview */}
        <div className="mt-3 flex justify-center">
          {post.photo && (
            <img
              src={`http://localhost:7777/uploads/${post.photo}`}
              alt="Post"
              className="mt-3 rounded-lg shadow-sm max-h-80 object-cover"
            />
          )}
          {post.video && (
            <video
              src={`http://localhost:7777/uploads/${post.video}`}
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
        <div style={{ marginTop: "10px" }}>
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Write your opinion"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Comment</button>
          </form>
        </div>

        {/* Comments toggle */}
        <button onClick={toggleComments}>
          {showComments ? "Hide comments" : "View comments"}
        </button>

        {/* Comments list */}
        {showComments &&
          comments.map((c) => (
            <p key={c.id}>
              <strong>@{c.username}:</strong> {c.content}
            </p>
          ))}
      </div>
    </div>
  );
});

export default Post;
