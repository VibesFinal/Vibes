import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
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
      console.log("⚠️ Server error response:", error.response.data);

      const errData = error.response.data;
      const msg =
        typeof errData === "string"
          ? errData
          : errData.message || JSON.stringify(errData);

      alert("Login Error: " + msg);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </div>

      {!welcomeMessage ? (
        /* Login Form */
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border-2 border-cyan-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide text-center">
              Login
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-colors text-gray-800 placeholder-gray-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-colors text-gray-800 placeholder-gray-400"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full border-2 border-cyan-400 text-cyan-600 font-semibold py-3 rounded-xl hover:bg-cyan-400 hover:text-white transition-all duration-300 shadow-md"
            >
              Create your account
            </button>
          </form>
        </div>
      ) : (
        /* Welcome Screen */
        <div className="w-full max-w-md text-center bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 text-white p-8 rounded-2xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-6">✨ Welcome to Your Safe Space</h3>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 text-left">
            <p className="text-sm leading-relaxed">{welcomeMessage}</p>
          </div>

          <button
            onClick={() => {
              onLogin();
              navigate("/");
            }}
            className="w-full bg-white text-indigo-700 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue to Home
          </button>
        </div>
      )}
    </div>
  );
}