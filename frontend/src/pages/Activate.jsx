import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import vLogo from "../components/images/v_logo.png"; 

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
      .get(`http://localhost:7777/user/verify/${token}`)
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
        setMessage(
          err.response?.data?.message ||
            err.response?.data ||
            "Activation failed. Please try again."
        );
        setSuccess(false);
      })
      .finally(() => setLoading(false)); // Stop loading
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-500 via-white to-blue-800 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
        
        {/* Logo */}
        <img
          src={vLogo}
          alt="Vibe Logo"
          className="w-24 h-24 mx-auto mb-6"
        />

        {loading ? (
          <>
            {/* Loading state */}
            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto" />
            <p className="mt-4 text-gray-700 text-lg">Activating your account...</p>
          </>
        ) : (
          <>
            {/* Success or failure icon */}
            {success ? (
              <CheckCircle className="w-16 h-16 text-cyan-600 mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-blue-800 mx-auto" />
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
