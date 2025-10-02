// src/components/ForgotPassword.jsx
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/v_logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/user/forgot-password", { email });
      setMessage(res.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      {/* Logo */}
      <img src={logo} alt="Logo" className="w-20 h-auto mb-4 drop-shadow-sm" />

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-cyan-200">
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide text-center mb-6">
          Forgot Password
        </h2>

        {message ? (
          <div className="text-center text-cyan-600 font-semibold bg-cyan-50 py-3 px-4 rounded-xl shadow-sm">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-cyan-200 rounded-xl 
                        focus:border-cyan-400 focus:outline-none focus:ring-2 
                        focus:ring-cyan-300 transition text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-300 
                        text-white font-semibold py-4 rounded-xl shadow-lg 
                        hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-6 text-red-600 text-center font-medium bg-red-50 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
