import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/v_logo.png";
import TherapistCertificationUpload from "../components/TherapistCertificationUpload";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //for therapists
  const [isTherapist , setIsTherapist] = useState(false);
  const [certification , setCertification] = useState(null);


  const navigate = useNavigate();


  const handleTherapistChange = (checked, file) => {

    setIsTherapist(checked);
    setCertification(file);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      //register a normal user
      await axiosInstance.post("/user/register", {

        username,
        email,
        password,

      });

      //if a therapist , upload a file
      if(isTherapist && certification){

        const formData = new FormData();
        formData.append("certification" , certification);
        formData.append("username", username);

          await axiosInstance.post("/api/therapist/upload-registration", formData, {

          headers: { "Content-Type": "multipart/form-data" },

        });

      }

      alert(

        isTherapist
          ? "Registration successful! Await admin approval for therapist role"
          : "Registration successful! Happy login Viber"

      );
      onRegister?.();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert(error.response?.data || "Error registering user");
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
      <div className="flex flex-col justify-center items-center text-center px-12">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-20 h-auto" />
        </div>
        <h1 className="text-5xl font-bold text-[#C05299] mb-6">Join Us</h1>
        <p className="text-xl text-[#9333EA] max-w-md">
          Start your journey to wellness and peace. We're excited to have you here.
        </p>
      </div>
    </div>

    {/* Right Side - Register Form */}
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-8 relative z-10 -translate-y-0 lg:ml-auto">
      <div className="w-full max-w-md rounded-2xl p-8  border-purple-200">
        <h2 className="text-2xl font-bold text-[#C05299] max-w-md tracking-wide text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="appearance-none w-full px-5 py-4 bg-purple-50/50 border-2 border-[#C05299] rounded-xl focus:border-[#C0529950] focus:outline-none focus:ring-2 focus:ring-[#C05299] transition-colors text-gray-800 placeholder:text-purple-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <TherapistCertificationUpload onChange={handleTherapistChange} />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#9333EA] to-[#C05299] hover:from-[#7E22CE] hover:to-[#A74482] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70"
          >
            Create your account
          </button>
        </form>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full border-2 border-[#C05299] text-[#C05299] font-semibold py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#9333EA] hover:to-[#C05299] hover:text-white hover:border-transparent transition-all duration-300 shadow-md"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
);

}