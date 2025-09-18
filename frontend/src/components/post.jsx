import { useState , useEffect } from "react";

import axiosInstance from "../api/axiosInstance";

import "../styles/post.css"

//import { Link, Navigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import ReactionButton from "./Reactions";




export default function Post( { post } ){

    const [ comment , setComment ] = useState("");

    const [comments , setComments] = useState([]);

    const [showComments , setShowComments] = useState(false);

    const [likes , setLikes] = useState(0);

    const [likedByUser , setLikedByUser] = useState(false);

    const [ reactionType , setReactionType ] = useState(null);

    const [ reactionCount , setReactionCount ] = useState({});




    // for navigation to other pages
    const navigate = useNavigate();

    //

    useEffect(() => {

        fetchReactions();

    } , []);

    
    //fetching the reactions from the backend
    const fetchReactions = async () => {

        try {
            
            const res = await axiosInstance.get(`/likes/like/${post.id}`);
            setReactionType(res.data.reactionType);
            setReactionCount(res.data.counts || {});

            setLikedByUser(res.data.likedByUser); 

                setLikes(

                    Object.values(res.data.counts || {}).reduce((a, b) => a + b, 0)

             ); 


        } catch (error) {

            console.error("error fetching reactions", error);
            
            
        }

    };


    //handling the reaction click
    const handleReaction = async (type) => {

        try {

            if (type === reactionType) {
            // user clicked the same reaction → delete it
            await axiosInstance.delete(`/likes/like/${post.id}`);

            } else {

            await axiosInstance.post(`/likes/like/${post.id}`, { reaction_type: type });

            }

            fetchReactions(); // refresh state from backend

        } catch (error) {

            console.error("error reacting", error);
            alert("you must be logged in to react");

        }

    };
    

    //handling the like
    const handleLike = async () => {

        try {
            
            if(likedByUser){

                await axiosInstance.delete(`/likes/like/${post.id}`);

                setLikes((prev) => prev - 1);

            } else {

                await axiosInstance.post(`/likes/like/${post.id}`);

                setLikes((prev) => prev + 1);

            }

            setLikedByUser(!likedByUser);

        } catch (error) {

            console.error("like error" , error);

            alert("you must be logged in to like")
            
        }

    };

    const fetchComments = async () => {


        try {
            
            const res = await axiosInstance.get(`/comments/${post.id}`);

            setComments(res.data);

        } catch (error) {
            
            console.error("error fetching comments" , error);
            

        }


    };

    const handleCommentSubmit = async (e) => {

        e.preventDefault();

        if(!comment.trim()) return alert("comment cannot be empty");

        try {

            await axiosInstance.post(`/comments/${post.id}` , { content : comment });

            setComment("");

            fetchComments(); //to refresh the comments
            
        } catch (error) {

            console.error("error adding a comment" , error);

            alert("you must be logged in to comment");
            
        }


    };

    //comments up and down
    const toggleComments = () => {

        if(!showComments) fetchComments();

        setShowComments(!showComments);

    }

    //

    const goToProfile = () => {

        if(!post.is_anonymous && post.username){

            navigate(`/profile/${post.username}`);

        }

    };
return (

  <div className="outerCard">

    <div className="postCard">

      {/* Username */}
      <h3 onClick={goToProfile} className="profileNameLink">

        @{post.is_anonymous ? "Anonymous" : post.username}

      </h3>

      {/* Post content */}
      <p>{post.content}</p>

      <p>{post.category || "General"}</p>

      <small>{new Date(post.created_at).toLocaleString()}</small>

      
                {/*media preview*/}

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

}