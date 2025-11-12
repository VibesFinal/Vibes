import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

// 🧭 Pages
import Feed from "./pages/feed";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import About from "./pages/About";
import Error from "./pages/Error404";
import Chatbot from "./pages/chatBot";
import HealthFAQ from "./pages/HealthFAQ";
import Community from "./pages/community";
import CreateCommunity from "./pages/createCommunity";
import CommunityChat from "./pages/CommunityChat";
import Activate from "./pages/Activate";
import DeleteAccount from "./pages/DeleteAccount";
import AdminCertifications from "./pages/AdminsCertifications";
import ChatInbox from "./pages/ChatInbox";
import Landing from "./pages/Landing";
import { BACKEND_URL } from "./api/axiosInstance";

// 🧩 Components
import Navigation from "./components/Navigation";
import NotificationBell from "./components/NotificationBell";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import InviteButton from "./components/InviteButton";

// 🧠 Context
import { NotificationProvider } from "./context/NotificationContext";

// Helper Components (keeping all your existing helper components)
const ScrollToFAQ = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#faq-section") {
      document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return null;
};

const FloatingFAQButton = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Open Mental Health Chatbot"
    className="fixed bottom-24 right-6 md:bottom-8 md:left-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#C05299] to-[#9b3d7a] shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-transform duration-150 text-white flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-pink-300/50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 md:h-8 md:w-8"
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

const AdminRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;
  if (!user || user.role !== "admin") return <Navigate to="/" />;

  return element;
};

const AuthenticatedLayout = ({ children, onLogout, userId }) => {
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("chatbot-open", showChatBot);
    return () => document.body.classList.remove("chatbot-open");
  }, [showChatBot]);

  return (
    <NotificationProvider userId={userId}>
      <Navigation onLogout={onLogout}>
        <NotificationBell />
      </Navigation>

      <FloatingFAQButton onClick={() => setShowChatBot(true)} />

      {showChatBot && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 animate-fadeIn"
          onClick={() => setShowChatBot(false)}
        >
          <div
            className="absolute inset-6 md:inset-auto md:bottom-10 md:left-32 bg-white rounded-2xl shadow-2xl 
                      w-[90%] max-w-sm md:w-[350px] md:h-[520px] overflow-hidden animate-slideRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#C05299] to-[#9b3d7a] px-4 h-[70px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
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
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    Mental Health Assistant
                  </h3>
                  <p className="text-white/80 text-[10px] hidden md:block">Always here to help</p>
                </div>
              </div>

              <button
                onClick={() => setShowChatBot(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-150"
                aria-label="Close chatbot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-[calc(100%-70px)]">
              <Chatbot />
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
            @keyframes slideRight {
              from {opacity:0; transform:translateX(-30px);}
              to {opacity:1; transform:translateX(0);}
            }
            .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
            .animate-slideRight { animation: slideRight 0.2s ease-out; }
            @media (max-width:768px){
              body.chatbot-open{overflow:hidden;}
            }
          `}</style>
        </div>
      )}

      <ScrollToFAQ />
      {children}
    </NotificationProvider>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser?.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* ✅ PUBLIC ROUTES - MUST BE FIRST, OUTSIDE AUTH CHECK */}
        <Route 
          path="/user/verify/:token" 
          element={<Activate onActivate={() => setIsAuthenticated(true)} />} 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/delete/:token" element={<DeleteAccount />} />
        
        {/* Unauthenticated Routes */}
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          /* ✅ Authenticated Routes */
          <>
            <Route 
              path="/" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <Navigate to="/feed" replace />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/feed" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <Feed />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/profile/:username" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <Profile />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/community" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <Community />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/community/create" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <CreateCommunity />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/communities/:id/chat" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <CommunityChat />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/health-faq" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <HealthFAQ />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <ChatInbox />
                </AuthenticatedLayout>
              } 
            />
            <Route
              path="/admin/certifications"
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <AdminRoute element={<AdminCertifications />} />
                </AuthenticatedLayout>
              }
            />
            <Route 
              path="*" 
              element={
                <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} userId={userId}>
                  <Error />
                </AuthenticatedLayout>
              } 
            />
          </>
        )}
      </Routes>
    </Router>
  );
}