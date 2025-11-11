import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import vLogo from "../components/images/v_logo.png"; 
import { handleError } from "../utils/alertUtils";
import { BACKEND_URL } from "../api/axiosInstance";

export default function DeleteAccount() {
  const [loading, setLoading] = useState(true); 
  const [message, setMessage] = useState("");   
  const [success, setSuccess] = useState(false); 

  const navigate = useNavigate();
  const { token } = useParams(); // token from URL

  useEffect(() => {
    if (!token) {
      setMessage("❌ Invalid deletion link.");
      setSuccess(false);
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/user/delete/${token}`)
      .then((res) => {
        // Clear user session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMessage(res.data || "Your account has been permanently deleted.");
        setSuccess(true);

        // Redirect to homepage after 3 seconds
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        console.error("Deletion error:", err);
        handleError(err); 
        setMessage(
          err.response?.data?.message ||
          err.response?.data ||
          "Account deletion failed or link expired."
        );
        setSuccess(false);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

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

      {/* Card container */}
      <div className="relative z-10 w-full max-w-md bg-purple-50/50 backdrop-blur-sm rounded-2xl p-8 text-center flex flex-col items-center">
        
        {/* Logo */}
        <img
          src={vLogo}
          alt="Vibe Logo"
          className="w-24 h-24 mx-auto mb-12 drop-shadow-sm"
        />

        {loading ? (
          <>
            {/* Loading state */}
            <Loader2 className="w-12 h-12 text-[#C05299] animate-spin mx-auto" />
            <p className="mt-4 text-gray-700 text-lg">Processing your request...</p>
          </>
        ) : (
          <>
            {/* Success or failure icon */}
            {success ? (
              <CheckCircle className="w-16 h-16 text-[#C05299] mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-[#9333EA] mx-auto" />
            )}

            {/* Display message */}
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {message}
            </h2>
          </>
        )}
      </div>
    </div>
  );

}
