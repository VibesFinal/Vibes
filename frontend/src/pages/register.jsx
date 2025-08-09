import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Register( { onRegister } ){

    const [username , setUsername] = useState("");

    const [email , setEmail] = useState("");

    const [password , setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            
            await axiosInstance.post("/user/register" , {

                username,
                email,
                password,

            });

            alert("Registration successful ! Happy login Viber");

            onRegister?.();
            navigate("/login");


        } catch (error) {

            console.error("Registration failed" , error);

            alert(error.response?.data || "error registering user");
            
        }

    };

    return (


        <form onSubmit={handleSubmit}>

            <h2>Register</h2>

            <input
            
                type="text"

                placeholder="Username"

                value={username}

                onChange={(e) => setUsername(e.target.value)}
            
            />

            <input
            
                type="email"

                placeholder="Email"

                value={email}

                onChange={(e) => setEmail(e.target.value)}
            
            />

            <input 
            
                type="password"

                placeholder="Password"

                value={password}

                onChange={(e) => setPassword(e.target.value)}
            
            />

            <button type="submit">Create your account</button>

        </form>


    );

}