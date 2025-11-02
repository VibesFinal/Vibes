import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/v_logo.png";
import { handleError } from "../utils/alertUtils";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/user/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.welcomeMessage) {
        localStorage.setItem("welcomeMessage", res.data.welcomeMessage);
        console.log("🎉 Welcome message stored:", res.data.welcomeMessage);
      }

      onLogin();
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col lg:flex-row relative">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 -z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Welcome Section (now visible on all screens) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-6 sm:px-12 pt-20 sm:pt-20 relative z-10">
        <img src={logo} alt="Logo" className="w-16 sm:w-20 mb-6" />
        <h1 className="text-3xl sm:text-5xl font-bold text-[#C05299] mb-4 sm:mb-6">
          Welcome Back
        </h1>
        <p className="text-base sm:text-xl text-[#9333EA] max-w-md">
          Your journey to wellness and peace continues here. We're glad to have you.
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 py-10 pt-24 sm:pt-24 pb-6 relative z-10 lg:translate-y-8">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-[#C05299] text-center">
            Login
          </h2>
          
          <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl px-6 sm:px-8 pt-0 lg:pt-0 pb-6 sm:pb-8">
            <div className="space-y-5 sm:space-y-6">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400 text-base"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none w-full px-5 py-4 bg-purple-50/50 border-2 border-[#C05299] rounded-xl focus:border-[#C05299] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition text-gray-800 placeholder:text-purple-400"
              />

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#9333EA] to-[#C05299] hover:from-[#7E22CE] hover:to-[#A74482] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full border-2 border-[#C05299] text-[#C05299] font-semibold py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#9333EA] hover:to-[#C05299] hover:text-white hover:border-transparent transition-all duration-300 shadow-md"
              >
                Create your account
              </button>

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
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
