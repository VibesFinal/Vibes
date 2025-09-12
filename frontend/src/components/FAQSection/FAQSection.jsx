// src/components/FAQSection/FAQSection.jsx
import React from 'react';
import FAQItem from './FAQItem';
import './FAQstyle.css';

const FAQSection = () => {
  const faqs = [
    {
      question: "What services are covered under my health insurance plan?",
      answer: "Most health insurance plans cover preventive care, hospital stays, emergency services, prescription drugs, mental health services, and maternity care. Check your policy document or contact your insurer for exact details."
    },
    {
      question: "How do I find an in-network doctor?",
      answer: "Log into your insurance provider’s website or app and use their provider directory. You can search by specialty, location, or name. Always confirm directly with the provider that they accept your insurance before scheduling."
    },
    {
      question: "What should I do in a medical emergency?",
      answer: "Call 911 or go to the nearest emergency room immediately. Most insurance plans cover emergency care regardless of network status. Keep your insurance card and ID handy."
    },
    {
      question: "Can I change my primary care physician?",
      answer: "Yes, most health plans allow you to change your PCP once per year or during special enrollment periods. Contact your insurer’s customer service or update it through their online portal."
    },
    {
      question: "Are telehealth visits covered?",
      answer: "Yes, nearly all major insurers now cover telehealth visits for primary care, mental health, and chronic condition management. Check your plan’s benefits or ask your provider about virtual visit options."
    },
    {
      question: "How do I appeal a denied claim?",
      answer: "Review the denial letter for reasons and deadlines. Gather supporting documents (doctor notes, test results) and submit a formal appeal in writing. Most insurers have a dedicated appeals process outlined on their website."
    },
    {
      question: "What is the difference between deductible, copay, and coinsurance?",
      answer: "Deductible: amount you pay before insurance kicks in. Copay: fixed fee for a service (e.g., $30 for a doctor visit). Coinsurance: percentage you pay after deductible (e.g., 20% of cost)."
    },
    {
      question: "Is mental health care covered the same as physical health?",
      answer: "Under the Mental Health Parity and Addiction Equity Act, most plans must provide equal coverage for mental and physical health conditions. This includes therapy, counseling, and substance abuse treatment."
    }
  ];

   return (
    <div className="faq-container">
      <h1 className="faq-title">Most Frequently Asked Questions About Health Care</h1>
      <ul className="faq-list">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </ul>
    </div>
  );
};

export default FAQSection;