import { useState } from "react";

import axiosInstance from "../api/axiosInstance";

import "../styles/newPost.css";


export default function NewPost( { onPostCreated } ){

    const [ content , setContent ] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!content.trim()) return alert("Post cannot be empty");

        try {
            
            const res = await axiosInstance.post("/posts" , { content });

            setContent("");

            if(onPostCreated) onPostCreated(res.data);

        } catch (error) {

            console.error("Error creating post ", error);
            
            alert("you must be logged in to create a post");
            
        }


    };

    return (

        <form onSubmit={handleSubmit} className="newPostForm">

            <textarea 
            
                value={content}

                onChange={(e) => setContent(e.target.value)}

                placeholder="What's on your mind"

                rows="3"

                
            
            
            />

            <button type="submit">Post</button>

        </form>


    );

}