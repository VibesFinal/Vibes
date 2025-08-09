import axiosInstance from "../api/axiosInstance";

import Post from "../components/post";

import { useState , useEffect } from "react";

import NewPost from "./newPost";

import "../styles/feed.css";


export default function Feed(){

    const [posts , setPosts] = useState([]);
    const [loading , setLoading] = useState(true);
 
    useEffect(() => {


        fetchPosts();

    } , []);

    const fetchPosts = async () => {

        try {
            
            const res = await axiosInstance.get("/posts");
            setPosts(res.data);

        } catch (error) {

            console.error("error fetching the posts", error);
                        
        } finally {

            setLoading(false);

        }


    }

    return (

        <div className="feedPage">

            <h2>Feed</h2>

            <NewPost onPostCreated={(newPost) => setPosts([newPost , ...posts])}/>

            {loading ? 

                (<p>Loading posts...</p>) :

                (posts.map((post) => <Post key={post.id} post={post}/>))

            }

        </div>


    );


}