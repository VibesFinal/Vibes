import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import logo from "../components/images/v_logo.png";

export default function ResetPassword() {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    //Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting new password for token:", token);
      const res = await axiosInstance.post(`/user/reset-password/${token}`, { password });
      console.log("Reset response:", res.data);
      setMessage(res.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Reset error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md bg-purple-50/50 backdrop-blur-sm rounded-2xl p-8  flex flex-col items-center">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-20 h-auto mb-6 drop-shadow-sm" />

        <h2 className="text-2xl font-bold text-[#C05299] tracking-wide text-center mb-6">
          Reset Password
        </h2>

        {message ? (
          <div className="text-center text-[#C05299] font-semibold bg-white/30 py-3 px-4 rounded-xl shadow-sm mb-4">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* New Password */}
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="appearance-none w-full px-5 py-4 bg-purple-50/50 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="appearance-none w-full px-5 py-4 bg-purple-50/50 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#9333EA] to-[#C05299] hover:from-[#7E22CE] hover:to-[#A74482] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium bg-red-50 py-2 px-4 rounded-lg w-full">
            {error}
          </p>
        )}

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full border-2 border-[#C05299] text-[#C05299] font-semibold py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#9333EA] hover:to-[#C05299] hover:text-white hover:border-transparent transition-all duration-300 shadow-md"
        >
          Back to Login
        </button>
      </div>
    </div>
  );

}
