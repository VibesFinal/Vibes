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
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DeleteAccount from './pages/DeleteAccount';
import AdminCertifications from './pages/AdminsCertifications';
import ChatInbox from './pages/ChatInbox'

// Helper component to handle scrolling to #faq-section
const ScrollToFAQ = () => {
  const location = useLocation();

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

const FloatingFAQButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Mental Health Chatbot"
      className="fixed bottom-8 left-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#C05299] to-[#9b3d7a] shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-transform duration-150 text-white flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-pink-300/50 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
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
    </button>
  );
};



export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatBot , setShowChatBot] = useState(false);


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


  //admin route
const AdminRoute = ({element}) => {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if(!token){

    return <Navigate to="/login" />

  }

  if(!user || user.role !== "admin"){

    return <Navigate to="/"/> //non admins go back to feed

  }

  return element;

};

  return (
    <Router>
      {/* ✅ Wrap authenticated part with NotificationProvider */}
      {isAuthenticated && userId && (
        <NotificationProvider userId={userId}>
          <Navigation onLogout={() => setIsAuthenticated(false)}>
            {/* ✅ Inject NotificationBell into Navigation */}
            <NotificationBell />
          </Navigation>

          <FloatingFAQButton onClick={() => setShowChatBot(true)} />
{showChatBot && (
  <div 
    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
    style={{ animation: 'fadeIn 0.15s ease-out' }}
    onClick={() => setShowChatBot(false)}
  >
    <div 
      className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[600px] sm:h-[650px] relative overflow-hidden"
      style={{ animation: 'slideUp 0.2s ease-out' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C05299] to-[#9b3d7a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
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
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Mental Health Assistant</h3>
            <p className="text-white/80 text-xs">Always here to help</p>
          </div>
        </div>
        <button
          onClick={() => setShowChatBot(false)}
          className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-150"
          aria-label="Close chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Chatbot Content */}
      <div className="h-[calc(100%-72px)]">
        <Chatbot />
      </div>
    </div>
  </div>
)}




          <ScrollToFAQ />

          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/user/verify/:token" element={<Activate />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/About" element={<About />} />
            
            <Route path="/Community" element={<Community />} />
            <Route path="/community/create" element={<CreateCommunity />} />
            <Route path="/communities/:id/chat" element={<CommunityChat />} />
            <Route path="/health-faq" element={<HealthFAQ />} />
            <Route path="/chat" element={<ChatInbox />} />

            <Route 
            
              path='/admin/certifications'
              element={<AdminRoute element={<AdminCertifications />}/>}
            
            />

            {/* //  New routes for password reset */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* New route for account deletion */}
            <Route path="/delete/:token" element={<DeleteAccount />} />

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/verify/:token" element={<Activate />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/delete/:token" element={<DeleteAccount />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}