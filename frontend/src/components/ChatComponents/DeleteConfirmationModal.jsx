import React, { useEffect } from 'react';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#9FD6E2]/80 via-[#DCC6A0]/60 to-[#F0F0F0]/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onCancel}
      />
      
      {/* Modal container */}
      <div className="relative w-full max-w-md transform transition-all duration-300 scale-95 animate-in fade-in-0 zoom-in-95">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#B8E986] rounded-full opacity-20 animate-float"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#73C174] rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 -right-6 w-4 h-4 bg-[#9FD6E2] rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main modal content */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Warning header with gradient */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 p-6">
            <div className="flex items-center justify-center space-x-3">
              {/* Animated warning icon */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 border-2 border-red-400 rounded-2xl animate-ping opacity-20"></div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Delete Message
                </h3>
                <p className="text-sm text-red-500 font-medium mt-1">Irreversible Action</p>
              </div>
            </div>
          </div>

          {/* Modal body */}
          <div className="p-6 space-y-4">
            {/* Warning message */}
            <div className="text-center space-y-2">
              <p className="text-gray-700 text-lg font-medium">
                Are you sure you want to delete this message?
              </p>
              <p className="text-gray-500 text-sm">
                This action cannot be undone and the message will be permanently removed from the conversation.
              </p>
            </div>

            {/* Visual warning indicator */}
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-red-500 font-medium uppercase tracking-wider">
                Permanent Deletion
              </div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 p-6 bg-gray-50/50 border-t border-gray-100">
            <button
              onClick={onCancel}
              className="flex-1 group relative px-6 py-3 bg-gradient-to-br from-[#F0F0F0] to-[#DCC6A0] text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DCC6A0] focus:ring-opacity-50 overflow-hidden"
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <span className="relative flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </span>
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 group relative px-6 py-3 bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 overflow-hidden"
            >
              {/* Animated hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete Forever</span>
              </span>
            </button>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-300 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-300 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#DCC6A0] rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#DCC6A0] rounded-br-3xl"></div>
        </div>

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-red-500 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;