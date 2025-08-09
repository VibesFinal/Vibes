import { useEffect, useState } from "react";
import { json, Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"
import logo from "./images/v_logo.png"

export default function Navigation( { onLogout } ){

    const navigate = useNavigate();

    //
    const [currentUserId , setCurrentUserID] = useState(null);

    //

    useEffect(() => {

        const token = localStorage.getItem("token");

        if(token) {

            try {
                
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserID(payload.id);

            } catch (error) {
                
                console.error("error decoding token", error);
                

            }

        }

    } , [])

    //

    const handleLogout = () => {

        localStorage.removeItem("token"); //remove the token

        onLogout(); //telling the app.jsx that the user is logged out

        navigate("/login"); //sending the user to the login page

        
    }

    
    return(


        <header className="navbar">

            <div id="logo">
                
                <img src={logo}/>    
                
            </div> 

            <nav>


                <ul className="navLinks">

                    <li><Link to = "/">Feed</Link></li>


                    <li>

                        {currentUserId ? (

                            <Link to={`/profile/${currentUserId}`}>Profile</Link>

                        ) : (

                            <span>Profile</span>

                        )}

                    </li>



                    <li><Link to = "About">About</Link></li>

                    <li><button onClick={handleLogout}>Logout</button></li>

                </ul>


            </nav>


        </header>


    );

}