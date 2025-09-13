import { useEffect, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "./images/v_logo.png";

export default function Navigation({ onLogout }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fetch current logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:7777/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  // Search users as you type
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:7777/user/search?username=${value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setSearchResults(data.users || []);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
    }
  };

  // Navigate to user profile when clicked
  const handleSelectUser = (username) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/profile/${username}`);
  };

  return (
    <header className="navbar">
      <div id="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" />
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
          <li><Link to="/about">About</Link></li>
          <li><Link to="/health-faq">Health FAQs</Link></li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>

          {/* Search Input */}
          <li className="searchContainer">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchResults.length > 0 && (
              <ul className="searchResults">
                {searchResults.map(user => (
                  <li key={user.id} onClick={() => handleSelectUser(user.username)}>
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
