import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import vLogo from "../components/images/v_logo.png"; 
import { showAlert, handleError } from "../utils/alertUtils";
import { BACKEND_URL } from "../api/axiosInstance";

export default function Activate() {
  // State to track loading, message, and success/failure
  const [loading, setLoading] = useState(true); 
  const [message, setMessage] = useState("");   
  const [success, setSuccess] = useState(false); 

  const navigate = useNavigate(); // To navigate programmatically
  const { token } = useParams(); // Get token from the URL

  useEffect(() => {
    // If no token is found in the URL
    if (!token) {
      setMessage("❌ Invalid activation link.");
      setSuccess(false);
      setLoading(false);
      return;
    }

    // Call backend API to verify the token
    axios
      .get(`${BACKEND_URL}/user/verify/${token}`)
      .then((res) => {
        const { token: sessionToken, welcomeMessage, user } = res.data;

        // Store token and user info in localStorage
        localStorage.setItem("token", sessionToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Set welcome message
        setMessage(welcomeMessage);
        setSuccess(true);

        // Redirect to login page after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        // Handle error response
        console.error("Activation error:", err);
        // setMessage(
        //   err.response?.data?.message ||
        //     err.response?.data ||
        //     "Activation failed. Please try again."
        // );
        // setSuccess(false);

        const errMsg = err.response?.data?.message || "Activation failed. Please try again.";
        setMessage(errMsg);
        setSuccess(false);
        showAlert(errMsg); 

      })
      .finally(() => setLoading(false)); // Stop loading
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
            <p className="mt-4 text-gray-700 text-lg">Activating your account...</p>
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
