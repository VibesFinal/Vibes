import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/v_logo.png";
import TherapistCertificationUpload from "../components/TherapistCertificationUpload";
import { showAlert, handleError } from "../utils/alertUtils";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //for therapists
  const [isTherapist, setIsTherapist] = useState(false);
  const [certification, setCertification] = useState(null);

  const navigate = useNavigate();

  const handleTherapistChange = (checked, file) => {
    setIsTherapist(checked);
    setCertification(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //register a normal user
      await axiosInstance.post("/user/register", { username, email, password });

      //if a therapist, upload a file
      if (isTherapist && certification) {
        const formData = new FormData();
        formData.append("certification", certification);
        formData.append("username", username);

        await axiosInstance.post("/api/therapist/upload-registration", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      showAlert(
        isTherapist
          ? "Registration successful! Await admin approval for therapist role"
          : "Registration successful! Happy login Viber",
        "success"
      );

      onRegister?.();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Animated mesh gradient background - Full Screen */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 -z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Mobile Logo - Only visible on mobile */}
      <div className="lg:hidden flex justify-center pt-8 pb-4">
        <img src={logo} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>

      {/* Left Side - Welcome Text (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="flex flex-col items-center text-center px-12 max-w-lg">
          {/* Logo */}
          <div className="mb-8">
            <img src={logo} alt="Logo" className="w-24 h-24 mx-auto" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-[#C05299] mb-6">
            Join Us
          </h1>
          <p className="text-xl xl:text-2xl text-[#9333EA]">
            Start your journey to wellness and peace. We're excited to have you here.
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 lg:py-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Welcome Text */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#C05299] mb-3">
              Join Us
            </h1>
            <p className="text-base sm:text-lg text-[#9333EA] px-4">
              Start your journey to wellness today
            </p>
          </div>

          {/* Register Form Card */}
          
              <h2 className="text-2xl sm:text-3xl font-bold text-[#C05299] tracking-wide text-center mb-6">
                Register
              </h2>

          <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="space-y-5 sm:space-y-6">


              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400 text-base"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400 text-base"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400 text-base"
                />

                <TherapistCertificationUpload onChange={handleTherapistChange} />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#9333EA] to-[#C05299] hover:from-[#7E22CE] hover:to-[#A74482] text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 text-base sm:text-lg"
                >
                  Create your account
                </button>
              </form>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full border-2 border-[#C05299] text-[#C05299] font-semibold py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#9333EA] hover:to-[#C05299] hover:text-white hover:border-transparent transition-all duration-300 shadow-md text-base"
              >
                Back to Login
              </button>
            </div>
          </div>

          {/* Optional: Back to home link for mobile */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-purple-600 font-medium text-sm hover:text-[#C05299] transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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