import { useState , useEffect } from "react";

import axiosInstance from "../api/axiosInstance";

import "../styles/post.css"

import { Link, Navigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";



export default function Post( { post } ){

    const [ comment , setComment ] = useState("");

    const [comments , setComments] = useState([]);

    const [showComments , setShowComments] = useState(false);

    const [likes , setLikes] = useState(0);

    const [likedByUser , setLikedByUser] = useState(false);

    // for navigation to other pages
    const navigate = useNavigate();

    //

    useEffect(() => {

        fetchLikes();

    } , []);

    //

    const fetchLikes = async () => {


        try {

            //get the likes count
            const countRes = await axiosInstance.get(`likes/like/count/${post.id}`);
            
            //get user's like status

            const userRes = await axiosInstance.get(`/likes/like/${post.id}`);

            
            
            /*const res = await axiosInstance.get(`likes/like/${post.id}`); */
            setLikes(Number(countRes.data.count) || 0);
            setLikedByUser(userRes.data.liked); 

        } catch (error) {

            console.error("error fetching likes", error);
            
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

    const toggleComments = () => {

        if(!showComments) fetchComments();

        setShowComments(!showComments);

    }

    //

    const goToProfile = () => {

        navigate(`/profile/${post.username}`);

    };

    return (

    <div className="outerCard">

        <div className="postCard">

          <h3 onClick={goToProfile} className="profileNameLink">@{post.username}</h3>  

            <p>{post.content}</p>

            <small>{new Date(post.created_at).toLocaleString()}</small>

            <div style={{marginTop: "10PX"}}>

                <button onClick={handleLike}>

                    {likedByUser ? "unlike" : "like"} ({likes})

                </button>

            </div>

            <div style={{marginTop : "10px"}}>

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

            <button onClick={toggleComments}>

                {showComments ? "Hide comments" : "View comments"}

            </button>

            {showComments && 
            
                comments.map((c) => (

                    <p key={c.id}>

                        <strong>@{c.username}:</strong> {c.content}

                    </p>

                ))

            }

    
    
        </div>

    </div>    

    );

}