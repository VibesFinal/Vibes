import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  type = 'warning' 
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger': return 'from-red-500 to-red-600';
      case 'success': return 'from-green-500 to-green-600';
      case 'info': return 'from-blue-500 to-blue-600';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#C05299]/30 via-[#D473B3]/40 to-[#E8A5D8]/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-[#D473B3]/30 overflow-hidden animate-in fade-in-0 zoom-in-95"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F5E1F0] to-[#FCF0F8] p-5 border-b border-[#D473B3]/20">
          <div className="flex items-start space-x-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${getIconColor()} shadow-md flex-shrink-0`}>
              {getIcon()}
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-5 bg-gradient-to-r from-[#FCF0F8] to-[#F5E1F0] border-t border-[#D473B3]/20">
          <button
            onClick={onCancel}
            className="px-4 py-3 w-full sm:flex-1 bg-white border border-[#D473B3]/30 text-gray-700 font-semibold rounded-xl hover:bg-[#F5E1F0] transition-colors duration-200 text-sm sm:text-base"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-3 w-full sm:flex-1 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity duration-200 text-sm sm:text-base bg-gradient-to-r ${getIconColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;