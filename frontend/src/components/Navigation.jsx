import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "./images/v_logo.png";

export default function Navigation({ onLogout }) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:7777/user/profile", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          const data = await res.json();
          setCurrentUser(data);
        } catch (error) {
          console.error("Failed to fetch user data: ", error);
        }
      };

      fetchUser();
    }
  }, []); // <-- Note: Removed dependency array empty? It's correct here since we only run on mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div id="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" /> {/* 👈 Always add alt text for accessibility */}
      </div>

      <nav>
        <ul className="navLinks">
          <li><Link to="/">Feed</Link></li>

          <li>
            {currentUser ? (
              <Link to={`/profile/${currentUser.username}`}>Profile</Link>
            ) : (
              <span>Profile</span>
            )}
          </li>

          <li><Link to="/chatBot">AI Listener</Link></li>

          <li><Link to="/about">About</Link></li> {/* 👈 Fixed: was "About" → should be "/about" */}

         
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}