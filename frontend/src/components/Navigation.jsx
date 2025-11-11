import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./images/v_logo.png";
import { UserCircle, House, UsersThree, ChatCircle, CaretDown, MagnifyingGlass, X, List, } from "phosphor-react";
import NotificationBell from "./NotificationBell";
import InviteButton from "./InviteButton";
import { BACKEND_URL } from "../api/axiosInstance";

export default function Navigation({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
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
          const res = await fetch(`${BACKEND_URL}/user/profile`, {
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
      const res = await fetch(`${BACKEND_URL}/user/search?username=${value}`, {
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

  // close dropdown when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.querySelector(".mobile-menu-container");
      const menuButton = document.querySelector(".mobile-menu-button");
      if (
        mobileMenuOpen &&
        menu &&
        !menu.contains(e.target) &&
        !menuButton.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    // Add event listener when mobile menu is open
    document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [mobileMenuOpen]);


  return (
    <>
      {/* Desktop Header - Hidden on Mobile */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100">
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
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-1">
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
                <span className="nav-label">Therapists</span>
              </Link>

              <Link
                to="/community"
                className={`nav-btn group ${location.pathname === "/community" ? "text-[#C05299]" : ""}`}
              >
                <UsersThree size={22} weight="regular" className={location.pathname === "/community" ? "text-[#C05299]" : ""} />
                <span className="nav-label">Community</span>
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-[300px] lg:w-[400px]">
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
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#C05299] to-[#d666ae] flex items-center justify-center text-white font-semibold">
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <p className="font-medium text-gray-700">{user.username}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <NotificationBell />

              {/* Profile Dropdown */}
              <div className="relative">
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
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#C05299] to-[#d666ae] flex items-center justify-center text-white font-semibold border-2 border-transparent group-hover:border-[#C05299] transition-all">
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
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#C05299] to-[#d666ae] flex items-center justify-center text-white font-semibold text-lg">
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

                      {currentUser?.id && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <InviteButton userId={currentUser.id} />
                        </div>
                      )}

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
                        to="/health-faq#faq-section"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9E6F0] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="text-gray-700 font-medium">Learn more</span>
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
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar - Only Logo, Search, and Notifications */}
      <header className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-9 pr-3 py-2 rounded-full bg-gray-100 border border-transparent focus:border-[#C05299] focus:ring-2 focus:ring-[#C05299]/30 focus:bg-white outline-none transition-all text-sm"
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
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#C05299] to-[#d666ae] flex items-center justify-center text-white font-semibold text-sm">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                      <p className="font-medium text-gray-700 text-sm">{user.username}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/"
            className={`mobile-nav-btn ${location.pathname === "/" ? "active" : ""}`}
          >
            <House size={24} weight={location.pathname === "/" ? "fill" : "regular"} />
            <span className="mobile-nav-label">Home</span>
          </Link>

          <Link
            to="/community"
            className={`mobile-nav-btn ${location.pathname === "/community" ? "active" : ""}`}
          >
            <UsersThree size={24} weight={location.pathname === "/community" ? "fill" : "regular"} />
            <span className="mobile-nav-label">Community</span>
          </Link>

          <Link
            to="/chat"
            className={`mobile-nav-btn ${location.pathname === "/chat" ? "active" : ""}`}
          >
            <ChatCircle size={24} weight={location.pathname === "/chat" ? "fill" : "regular"} />
            <span className="mobile-nav-label">Therapists</span>
          </Link>

          <Link
            to={`/profile/${currentUser?.username}`}
            className={`mobile-nav-btn ${location.pathname.startsWith("/profile") ? "active" : ""}`}
          >
            <UserCircle size={24} weight={location.pathname.startsWith("/profile") ? "fill" : "regular"} />
            <span className="mobile-nav-label">Profile</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-btn mobile-menu-button"
          >
            <List size={24} />
            <span className="mobile-nav-label">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-slideUp max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                {currentUser?.profile_pic ? (
                  <img
                    src={currentUser.profile_pic}
                    alt={currentUser.username}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#C05299] to-[#d666ae] flex items-center justify-center text-white font-semibold text-xl">
                    {currentUser?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {currentUser?.username || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              {currentUser?.id && (
                <div className="mb-4">
                  <InviteButton userId={currentUser.id} />
                </div>
              )}

              {currentUser?.role === "admin" && (
                <Link
                  to="/admin/certifications"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F9E6F0] transition-colors mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-gray-700 font-medium">Admin Dashboard</span>
                </Link>
              )}

              <Link
                to="/health-faq#faq-section"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F9E6F0] transition-colors mb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-gray-700 font-medium">Learn more</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
              >
                <span className="text-red-600 font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
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

        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          color: #6b7280;
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .mobile-nav-btn.active {
          color: #C05299;
        }

        .mobile-nav-btn:active {
          transform: scale(0.95);
        }

        .mobile-nav-label {
          font-size: 0.625rem;
          font-weight: 500;
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease forwards;
        }

        /* Add padding to body to prevent content from being hidden under bottom nav on mobile */
        @media (max-width: 768px) {
          body {
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </>
  );
}