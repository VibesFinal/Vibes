import { useEffect , useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import { useParams } from "react-router-dom";
import "../styles/profile.css";


export default function Profile(){

    const { userId } = useParams();
    const [posts , setPosts] = useState([]);
    const [loading , setLoading] = useState(true);

    const fetchUserPosts = async () => {

        try {
            
            const res = await axiosInstance.get(`/profile/${userId}`);
            setPosts(res.data);
            setLoading(false);

        } catch (error) {

            console.error("failed to fetch user posts", error);
            
        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {


        fetchUserPosts();

    } , [userId])

    return(

        <div className="profileContainer">

            <h2>User Profile</h2>

            {loading ? (

                <p>Loading...</p>

            ) : posts.length === 0 ? (

                <p>No posts found</p>

            ) : (

                posts.map((post) => <Post key={post.id} post={post} />)

            )}

        </div>

    );

}