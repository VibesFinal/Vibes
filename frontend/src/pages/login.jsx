import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login( { onLogin } ){

    const [username , setUsername] = useState("");
    
    const [password , setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            
            const res = await axiosInstance.post("/user/login" , {

                username,
                password,

            });

            //here we are saving the token
            localStorage.setItem("token" , res.data.token);
            onLogin();

            //redirect to the feed page

            navigate("/");

        } catch (error) {

            console.error("login failed" , error);

            alert("Invalid credentials");
            
        }

    };

    return(

    <div>    

        <form onSubmit={handleSubmit}>


            <h2>Login</h2>

            <input
            
                type="text"

                placeholder="Username"

                value={username}

                onChange={(e) => setUsername(e.target.value)}
            
            />

            <input
            
                type="password"

                placeholder="Password"

                value={password}

                onChange={(e) => setPassword(e.target.value)}
            
            />

            <button type="submit">Login</button>

        </form>

        <button onClick={() => navigate("/register")}>Create your account</button>

    </div>    
        


    );

}