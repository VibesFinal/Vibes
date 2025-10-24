import { useEffect, useState } from 'react';

export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Check if there's a welcome message in localStorage
    const message = localStorage.getItem('welcomeMessage');
    
    if (message) {
      setWelcomeMessage(message);
      setIsVisible(true);
      
      // Clear the message from localStorage after retrieving it
      localStorage.removeItem('welcomeMessage');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !welcomeMessage) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#9333EA] to-[#C05299] p-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-150"
            aria-label="Close welcome message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✨</span>
          </div>
          
          <h3 className="text-2xl font-bold text-white">
            Welcome to Your Safe Space
          </h3>
        </div>

        {/* Message content */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <p className="text-slate-700 leading-relaxed text-center">
              {welcomeMessage}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-[#9333EA] to-[#C05299] hover:from-[#7E22CE] hover:to-[#A74482] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Let's Begin
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}