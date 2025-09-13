import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/v_logo.png";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/user/register", {
        username,
        email,
        password,
      });

      alert("Registration successful! Happy login Viber");
      onRegister?.();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert(error.response?.data || "Error registering user");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      {/* Logo */}
      <div className="text-center mb-8">
        <img src={logo} alt="Vibes Logo" className="w-20 h-auto" />
      </div>

      {/* Registration Form */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-2 border-cyan-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 tracking-wide">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-5 py-4 bg-gray-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 bg-gray-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-4 bg-gray-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70"
          >
            Create your account
          </button>
        </form>
      </div>

      {/* Back to Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="mt-6 w-full max-w-md border-2 border-cyan-400 text-cyan-600 font-semibold py-3 rounded-xl hover:bg-cyan-400 hover:text-white transition-all duration-300 shadow-md"
      >
        Back to Login
      </button>
    </div>
  );
}