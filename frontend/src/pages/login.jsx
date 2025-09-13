
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../components/images/v_logo.png";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setWelcomeMessage("");

    try {
      const res = await axiosInstance.post("/user/login", {
        username,
        password,
      });
      // Save JWT and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const message = res.data.welcomeMessage;
      setWelcomeMessage(message);
      console.log("🎉 Welcome message received:", message);

    } catch (error) {
      console.error("Login failed", error);
      if (error.response) {
        alert("Login Error: " + (error.response.data || "Invalid credentials"));
      } else if (error.request) {
        alert("Network Error: Server not responding");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="logoLogin">
        <img src={logo} alt="Logo" />
      </div>

      {!welcomeMessage ? (
        <div className="loginContainer">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <button onClick={() => navigate("/register")}>
            Create your account
          </button>
        </div>
      ) : (
        <div className="welcomeMessageContainer">
          <h3>✨ Welcome from Gemini AI</h3>
          <div className="welcomeBubble">
            <p>{welcomeMessage}</p>
          </div>
          <button
            onClick={() => {
              onLogin();
              navigate("/");
            }}
          >
            Continue to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}