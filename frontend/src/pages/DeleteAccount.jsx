import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import vLogo from "../components/images/v_logo.png"; 

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
      .get(`http://localhost:7777/user/delete/${token}`)
      .then((res) => {
        // Clear user session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMessage(res.data || "Your account has been permanently deleted.");
        setSuccess(true);

        // Redirect to homepage after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        console.error("Deletion error:", err);
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
            <p className="mt-4 text-gray-700 text-lg">Processing your request...</p>
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
