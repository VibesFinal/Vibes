import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"
import logo from "./images/v_logo.png"

export default function Navigation( { onLogout } ){

    const navigate = useNavigate();

    //
    //const [currentUserId , setCurrentUserID] = useState(null);
    const [currentUser , setCurrentUser] = useState(null);

    //

    useEffect(() => {

        const token = localStorage.getItem("token");

        if(token){

            const fetchUser = async () => {

                try {
                    
                    const res = await fetch("http://localhost:7777/user/profile", {

                        headers: {

                            "Authorization": `Bearer ${token}`

                        }

                    });

                    const data = await res.json();

                    setCurrentUser(data);

                } catch (error) {

                    console.error("failed to fetch user data: ", error);
                       
                }

            };

            fetchUser();

        }

    } , []);

    //

    const handleLogout = () => {

        localStorage.removeItem("token"); //remove the token

        onLogout(); //telling the app.jsx that the user is logged out

        navigate("/login"); //sending the user to the login page

        
    }

    
    return(


        <header className="navbar">

            <div id="logo" onClick={() => navigate("/")}>
                
                <img src={logo}/>    
                
            </div> 

            <nav>


                <ul className="navLinks">

                    <li><Link to = "/">Feed</Link></li>


                    <li>

                        {currentUser ? (

                            <Link to={`/profile/${currentUser.username}`}>Profile</Link>

                        ) : (

                            <span>Profile</span>

                        )}

                    </li>

                    <li><Link to= "/chatBot">Ai listener</Link></li>



                    <li><Link to = "About">About</Link></li>

                    <li><button onClick={handleLogout}>Logout</button></li>

                </ul>


            </nav>


        </header>


    );

}