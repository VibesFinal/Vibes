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
          const res = await fetch("http://localhost:7777/user/profile", { // 👈 USE PORT 3000!
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();

          if (data && data.user && typeof data.user === 'object' && data.user.id !== undefined) {
            setCurrentUser(data.user);
          } else {
            console.warn("⚠️ Received invalid user data:", data);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("❌ Failed to fetch user ", error);
          setCurrentUser(null);
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
      const res = await fetch(`http://localhost:7777/user/search?username=${value}`, { // 👈 USE PORT 3000!
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error(`Search failed: ${res.status}`);

      const data = await res.json();
      setSearchResults(data.users || []);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
    }
  };

  // Navigate to user profile when clicked
  const handleSelectUser = (user) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/profile/${user.username}`); // 👈 CHANGED TO username
  };

  // Show loading state while fetching user
  if (currentUser === null) {
    return (
      <header className="navbar">
        <div id="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" />
        </div>

        <nav>
          <ul className="navLinks">
            <li><Link to="/">Feed</Link></li>
            <li>Loading...</li>
            <li><Link to="/chatBot">AI Listener</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
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
                    <li key={user.id} onClick={() => handleSelectUser(user)}>
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

  return (
    <header className="navbar">
      <div id="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" />
      </div>

      <nav>
        <ul className="navLinks">
          <li><Link to="/">Feed</Link></li>

          <li>
            {currentUser.id ? (
              <Link to={`/profile/${currentUser.id}`}>Profile</Link>
            ) : (
              <span>Profile</span>
            )}
          </li>

          <li><Link to="/chatBot">AI Listener</Link></li>
          <li><Link to="/about">About</Link></li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>

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
                  <li key={user.id} onClick={() => handleSelectUser(user)}>
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