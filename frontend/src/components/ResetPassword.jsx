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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      {/* Logo */}
      <img src={logo} alt="Logo" className="w-20 h-auto mb-4 drop-shadow-sm" />

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-cyan-200">
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide text-center mb-6">
          Reset Password
        </h2>

        {message ? (
          <div className="text-center text-cyan-600 font-semibold bg-cyan-50 py-3 px-4 rounded-xl shadow-sm">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-cyan-200 rounded-xl 
                         focus:border-cyan-400 focus:outline-none focus:ring-2 
                         focus:ring-cyan-300 transition text-gray-800 placeholder-gray-400"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Resetting..." : "Reset Password"}
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
