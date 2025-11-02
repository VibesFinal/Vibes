import React from 'react';

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  console.log('🔔 DeleteConfirmationModal rendered');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* Decorative gradient header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C05299] via-[#D473B3] to-[#E8A5D8] rounded-t-2xl"></div>

        {/* Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-2 sm:mb-3">
          Delete Message?
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm sm:text-base mb-6 sm:mb-8 px-1">
          Are you sure you want to delete this message? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-3 w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-opacity duration-200 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;