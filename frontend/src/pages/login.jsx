import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/v_logo.png";
import { handleError } from "../utils/alertUtils";

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
      const res = await axiosInstance.post("/user/login", { username, password });

      // Save JWT and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const message = res.data.welcomeMessage;
      setWelcomeMessage(message);
      console.log("🎉 Welcome message received:", message);
      // Show success alert
      // showAlert("Login successful!", "success");
    } catch (error) {
      console.error("Login failed", error);

      // if (error.response) {
      //   const errData = error.response.data;
      //   const msg = typeof errData === "string" ? errData : errData.message || JSON.stringify(errData);
      //   handleError("Login Error: " + msg);
      // } else if (error.request) {
      //   handleError("Network Error: Server not responding");
      // } else {
      //   handleError("Error: " + error.message);
      // }
      
      handleError(error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Animated mesh gradient background - Full Screen */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Left Side - Welcome Text */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 translate-x-40 -translate-y-10">
        {/* Content overlay */}
        <div className="flex flex-col justify-center items-center text-center px-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="w-20 h-auto" />
          </div>
          <h1 className="text-5xl font-bold text-[#C05299] mb-6">
            Welcome Back
          </h1>
          <p className="text-xl text-[#9333EA] max-w-md">
            Your journey to wellness and peace continues here. We're glad to have you.
          </p>
        </div>
      </div>


      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-8 relative z-10 -translate-y-0 lg:ml-auto">

        {!welcomeMessage ? (
          /* Login Form */
          <div className="w-full max-w-md rounded-2xl p-8  border-purple-200">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#C05299] max-w-md tracking-wide text-center">
                Login
              </h2>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none w-full px-5 py-4 bg-purple-50/50 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none w-full px-5 py-4 bg-purple-50/50 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400"
              />

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#9333EA] to-[#C05299] hover:from-[#7E22CE] hover:to-[#A74482] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full border-2 border-[#C05299] text-purple-600 font-semibold py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#9333EA] hover:to-[#C05299] hover:text-white hover:border-transparent transition-all duration-300 shadow-md"
              >
                Create your account
              </button>

              {/* Buttons for Forgot Password */}
              <div className="flex flex-col mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="w-full text-purple-600 font-semibold py-2 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Welcome Screen */
          <div className="w-full max-w-md text-center bg-gradient-to-r from-[#9333EA] to-[#C05299] text-white p-8 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">✨ Welcome to Your Safe Space</h3>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 text-left">
              <p className="text-sm leading-relaxed">{welcomeMessage}</p>
            </div>

            <button
              onClick={() => {
                onLogin();
                navigate("/");
              }}
              className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Continue to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}