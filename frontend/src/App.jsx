import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Feed from '../src/pages/feed';
import Login from './pages/login';
import Register from './pages/register';
import Navigation from './components/Navigation'; 
import Profile from './pages/profile';
import About from './pages/About';
import Error from './pages/Error404';
import Chatbot from './pages/chatBot';
import HealthFAQ from './pages/HealthFAQ';
import Community from './pages/community';
import CreateCommunity from './pages/createCommunity';
import InviteButton from "./components/InviteButton";
import CommunityChat from './pages/CommunityChat';
import Activate from './pages/Activate';
import { NotificationProvider } from './context/NotificationContext';
import NotificationBell from './components/NotificationBell';



// Helper component to handle scrolling to #faq-section
const ScrollToFAQ = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#faq-section') {
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return null;
};

// Floating Button Component (Reusable)
const FloatingFAQButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/health-faq#faq-section');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Open Mental Health FAQs — Your safe space"
      className="fixed bottom-8 left-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl hover:shadow-blue-400/40 transform hover:scale-110 transition-all duration-300 text-white flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300/50 animate-pulse"
    >
      {/* Speech bubble icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Subtle pulse glow effect */}
      <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>
    </button>
  );
};




export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:7777/');
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // ✅ Extract userId safely
  const userId = currentUser?.id;

  return (
    <Router>
      {/* ✅ Wrap authenticated part with NotificationProvider */}
      {isAuthenticated && userId && (
        <NotificationProvider userId={userId}>
          <Navigation onLogout={() => setIsAuthenticated(false)}>
            {/* ✅ Inject NotificationBell into Navigation */}
            <NotificationBell />
          </Navigation>

          <FloatingFAQButton />
          <ScrollToFAQ />

          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/user/verify/:token" element={<Activate />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/About" element={<About />} />
            <Route path="/chatBot" element={<Chatbot />} />
            <Route path="/Community" element={<Community />} />
            <Route path="/community/create" element={<CreateCommunity />} />
            <Route path="/communities/:id/chat" element={<CommunityChat />} />
            <Route path="/health-faq" element={<HealthFAQ />} />
            <Route path="*" element={<Error />} />
          </Routes>

          {currentUser?.id && <InviteButton userId={currentUser.id} />}
        </NotificationProvider>
      )}

      {/* ❌ Unauthenticated routes outside provider */}
      {!isAuthenticated && (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/verify/:token" element={<Activate />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}