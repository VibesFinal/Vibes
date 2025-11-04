import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/v_logo.png";
import TherapistCertificationUpload from "../components/TherapistCertificationUpload";
import { showAlert, handleError } from "../utils/alertUtils";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  //for therapists
  const [isTherapist, setIsTherapist] = useState(false);
  const [certification, setCertification] = useState(null);
  
  // for password validation
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [requirements, setRequirements] = useState({
    upperCase: false,
    number: false,
    specialChar: false,
    minLength: false,
  });

  const navigate = useNavigate();

  // handle password input change and validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setRequirements({
      upperCase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      minLength: value.length >= 8,
    });
  };

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
    <div className="min-h-[85vh] flex flex-col lg:flex-row relative">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 -z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Left Side - Welcome Text */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-6 sm:px-12 relative z-10">
        <img src={logo} alt="Logo" className="w-16 sm:w-20 mb-6" />
        <h1 className="text-3xl sm:text-5xl font-bold text-[#C05299] mb-4 sm:mb-6">
          Join Us
        </h1>
        <p className="text-base sm:text-xl text-[#9333EA] max-w-md">
          Start your journey to wellness and peace. We're excited to have you here.
        </p>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 pt-24 sm:pt-24 pb-6 relative z-10 lg:translate-y-4">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-[#C05299] text-center">
            Register
          </h2>

          <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl px-6 sm:px-8 pt-0 lg:pt-0 pb-3 sm:pb-8">
            <div className="space-y-4 sm:space-y-5">
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

                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="appearance-none w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400 text-base"
                  />

                  {/* Password strength checklist */}
                  {password && (
                    <div className="text-sm mt-1 text-gray-700 space-y-1">
                      <p className={requirements.upperCase ? "text-[#9333EA]" : "text-[#4c494e]"}>
                        {requirements.upperCase ? "✓" : "✘"} At least one uppercase letter
                      </p>
                      <p className={requirements.number ? "text-[#9333EA]" : "text-[#4c494e]"}>
                        {requirements.number ? "✓" : "✘"} At least one number
                      </p>
                      <p className={requirements.specialChar ? "text-[#9333EA]" : "text-[#4c494e]"}>
                        {requirements.specialChar ? "✓" : "✘"} At least one special character
                      </p>
                      <p className={requirements.minLength ? "text-[#9333EA]" : "text-[#4c494e]"}>
                        {requirements.minLength ? "✓" : "✘"} Minimum 8 characters
                      </p>
                    </div>
                  )}
                </div>

                <TherapistCertificationUpload onChange={handleTherapistChange} />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#9333EA] to-[#C05299] hover:from-[#7E22CE] hover:to-[#A74482] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 text-base sm:text-lg"
                >
                  Create your account
                </button>
              </form>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full border-2 border-[#C05299] text-[#C05299] font-semibold py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#9333EA] hover:to-[#C05299] hover:text-white hover:border-transparent transition-all duration-300 shadow-md"
              >
                Back to Login
              </button>

              <div className="text-center">
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