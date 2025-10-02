import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "./post";

export default function InfinitePostList( { selectedCategory , newPost } ){

    const [ posts , setPosts ] = useState([]);
    const [ offset , setOffset ] = useState(0);
    const [ loading , setLoading ] = useState(false);
    const [ hasMore , setHasMore ] = useState(true);

    const limit = 7;

    const observer = useRef();

    const lastPostRef = useCallback(

        (node) => {

            if(loading) return;

            if(observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {

                if(entries[0].isIntersecting && hasMore){

                    setOffset((prevOffset) => prevOffset + limit);

                }

            });

            if(node) observer.current.observe(node);

        },

        [loading , hasMore]

    );

    //reset when the category changes
    useEffect(() => {

        setPosts([]);
        setOffset(0);
        setHasMore(true);

    } , [selectedCategory])

    //fetch posts
    useEffect( () => {

        const fetchPosts = async () => {

            setLoading(true);

            try {
                
                const res = await axiosInstance.get("/posts" , {

                    params: {

                        limit, 
                        offset,
                        category: selectedCategory || undefined

                    },

                });

                if(res.data.length < limit){

                    setHasMore(false); //no more posts 

                }

                setPosts((prev) => { 
                const newPosts = res.data.filter(r => !prev.some(p => p.id === r.id));
                return [...prev, ...newPosts];

                });

            } catch (error) {

                console.error("error fetching posts : ", error);
                
            } finally {

                setLoading(false);

            }

        };

        fetchPosts();

    } , [offset , selectedCategory]);

    //add a new post on top

    useEffect(() => {

        if(newPost){

            setPosts((prev) => [newPost , ...prev]);

        }

    } , [newPost]);


   return (
  <div className="space-y-6">
    {posts.map((post, index) => {
      if (index === posts.length - 1) {
        return (
          <Post
            ref={lastPostRef}
            key={post.id}
            post={post}
            onDelete={(postId) =>
              setPosts((prev) => prev.filter((p) => p.id !== postId))
            }
          />
        );
      } else {
        return (
          <Post
            key={post.id}
            post={post}
            onDelete={(postId) =>
              setPosts((prev) => prev.filter((p) => p.id !== postId))
            }
          />
        );
      }
    })}

<<<<<<< Updated upstream
    {loading && <p className="text-center text-gray-500">loading...</p>}
    {!hasMore && <p className="text-center text-gray-400">No more posts</p>}
  </div>
);

=======
        
  <div className="space-y-6">
    {posts.map((post, index) => {
      if (index === posts.length - 1) {
        return (
          <Post
            ref={lastPostRef}
            key={post.id}
            post={post}
            onDelete={(postId) =>
              setPosts((prev) => prev.filter((p) => p.id !== postId))
            }
          />
        );
      } else {
        return (
          <Post
            key={post.id}
            post={post}
            onDelete={(postId) =>
              setPosts((prev) => prev.filter((p) => p.id !== postId))
            }
          />
        );
      }
    })}

    {loading && <p className="text-center text-gray-500">loading...</p>}
    {!hasMore && <p className="text-center text-gray-400">No more posts</p>}
  </div>

    );
>>>>>>> Stashed changes

}
