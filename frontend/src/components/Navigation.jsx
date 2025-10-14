import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./images/v_logo.png";
import {
  UserCircle,
  House,
  UsersThree,
  Robot,
  ChatCircle,
  CaretDown,
  MagnifyingGlass,
  X,
  List,
} from "phosphor-react";
import NotificationBell from "./NotificationBell";

export default function Navigation({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // <-- to detect active route
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:7777/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setCurrentUser(data.user || null);
        } catch {
          setCurrentUser(null);
        }
      };
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) return setSearchResults([]);
    try {
      const res = await fetch(`http://localhost:7777/user/search?username=${value}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setSearchResults(data.users || []);
    } catch {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/profile/${user.username}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-0 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-9 w-9 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea] to-[#a855f7] opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
              </div>
                <span className="font-bold text-2xl text-[#C05299]">
                ibes
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`nav-btn group ${location.pathname === "/" ? "text-[#C05299]" : ""}`}
              >
                <House size={22} weight="regular" className={location.pathname === "/" ? "text-[#C05299]" : ""} />
                <span className="nav-label">Home</span>
              </Link>

              <Link
                to={`/profile/${currentUser?.username}`}
                className={`nav-btn group ${
                  location.pathname.startsWith("/profile") ? "text-[#C05299]" : ""
                }`}
              >
                <UserCircle
                  size={22}
                  weight="regular"
                  className={location.pathname.startsWith("/profile") ? "text-[#C05299]" : ""}
                />
                <span className="nav-label">Profile</span>
              </Link>

              <Link
                to="/chat"
                className={`nav-btn group ${location.pathname === "/chat" ? "text-[#C05299]" : ""}`}
              >
                <ChatCircle size={22} weight="regular" className={location.pathname === "/chat" ? "text-[#C05299]" : ""} />
                <span className="nav-label">Chat</span>
              </Link>

              <Link
                to="/community"
                className={`nav-btn group ${location.pathname === "/community" ? "text-[#C05299]" : ""}`}
              >
                <UsersThree size={22} weight="regular" className={location.pathname === "/community" ? "text-[#C05299]" : ""} />
                <span className="nav-label">Community</span>
              </Link>

              <Link
                to="/chatBot"
                className={`nav-btn group ${location.pathname === "/chatBot" ? "text-[#C05299]" : ""}`}
              >
                <Robot size={22} weight="regular" className={location.pathname === "/chatBot" ? "text-[#C05299]" : ""} />
                <span className="nav-label">AI Bot</span>
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative hidden md:block w-[300px] lg:w-[400px]">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-transparent focus:border-[#C05299] focus:ring-2 focus:ring-[#C05299]/30 focus:bg-white outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                {searchResults.length > 0 && (
                  <ul className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto z-50">
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-all"
                      >
                        {user.profile_pic ? (
                          <img
                            src={user.profile_pic}
                            alt={user.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#73C174] to-[#9FD6E2] flex items-center justify-center text-white font-semibold">
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <p className="font-medium text-gray-700">{user.username}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Notification Bell */}
              <div className="hidden sm:block">
                <NotificationBell />
              </div>

              {/* Profile Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-all duration-300 group"
                >
                  <div className="relative">
                    {currentUser?.profile_pic ? (
                      <img
                        src={currentUser.profile_pic}
                        alt={currentUser.username}
                        className="h-9 w-9 rounded-full object-cover border-2 border-transparent group-hover:border-[#C05299] transition-all"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#73C174] to-[#9FD6E2] flex items-center justify-center text-white font-semibold border-2 border-transparent group-hover:border-[#73C174] transition-all">
                        {currentUser?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <CaretDown
                    size={14}
                    className={`text-gray-600 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slideDown">
                      <div className="p-4 border-b border-gray-100 bg-[#F2C0D5]">
                        <div className="flex items-center gap-3">
                          {currentUser?.profile_pic ? (
                            <img
                              src={currentUser.profile_pic}
                              alt={currentUser.username}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#73C174] to-[#9FD6E2] flex items-center justify-center text-white font-semibold text-lg">
                              {currentUser?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {currentUser?.username || "User"}
                            </p>
                            <p className="text-xs text-gray-500">{currentUser?.email}</p>
                          </div>
                        </div>
                      </div>

                      {currentUser?.role === "admin" && (
                        <Link
                          to="/admin/certifications"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9E6F0] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="text-gray-700 font-medium">Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/about"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9E6F0] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="text-gray-700 font-medium">About</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors text-left border-t border-gray-100"
                      >
                        <span className="text-red-600 font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-gray-700" />
                ) : (
                  <List size={24} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          color: #555;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(192, 82, 153, 0.1),
            rgba(192, 82, 153, 0.2)
          );
          color: #C05299;
        }

        .nav-label {
          font-size: 0.875rem;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease forwards;
        }
      `}</style>
    </>
  );
}
