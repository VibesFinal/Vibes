// src/components/FAQSection/FAQItem.jsx
import React, { useState } from 'react';
import './FAQstyle.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <li className="faq-item">
      <button
        className="faq-button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        {question}
        <svg width="20" height="20" fill="#3498db" viewBox="0 0 24 24">
          {isOpen ? (
            <path d="M19 13H5v-2h14v2z" />
          ) : (
            <path d="M12 8v8m0-8l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>
      <div className={`faq-content ${isOpen ? 'open' : ''}`}>
        {answer}
      </div>
    </li>
  );
};

export default FAQItem;