import { useEffect , useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Post from "../components/post";
import { useParams } from "react-router-dom";
import "../styles/profile.css";


export default function Profile(){

    const { username } = useParams();
    const [user , setUser] = useState(null);
    const [posts , setPosts] = useState([]);
    const [loading , setLoading] = useState(true);

    const fetchUserProfile = async () => {

        try {
            
            const res = await axiosInstance.get(`/profile/${username}`);

            setUser(res.data.user);

            setPosts(res.data.posts);
            

        } catch (error) {

            console.error("failed to fetch user posts", error);
            
        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {


        fetchUserProfile();

    } , [username])

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