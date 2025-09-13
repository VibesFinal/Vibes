// src/pages/HealthFAQ.js
import React from 'react';
import FAQSection from '../components/FAQSection/FAQSection';

const HealthFAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Optional: Add a header if needed */}
      <header className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Mental Health FAQs
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Answers to common questions about mental health coverage and support.
        </p>
      </header>

      {/* 👇 RENDER THE FULL FAQ SECTION HERE */}
      <FAQSection />
    </div>
  );
};

export default HealthFAQ;