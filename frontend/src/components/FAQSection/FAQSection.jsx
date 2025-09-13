import React, { useState } from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "What mental health conditions are covered by my insurance plan?",
      answer: "Most insurance plans cover treatment for depression, anxiety, bipolar disorder, PTSD, OCD, eating disorders, and substance use disorders. Therapy, counseling, and psychiatric medication management are typically included. Review your plan’s behavioral health benefits for specifics."
    },
    {
      question: "How do I find a licensed therapist or psychiatrist in my network?",
      answer: "Log into your insurer’s website or app and use their provider directory filtered for ‘mental health’ or ‘behavioral health.’ Search by specialty (e.g., psychologist, LCSW, psychiatrist), location, or telehealth availability. Always confirm they accept your insurance before booking."
    },
    {
      question: "Can I get therapy online (telehealth) through my insurance?",
      answer: "Yes, nearly all major insurers now cover telehealth therapy sessions for mental health, including video and phone visits. Coverage is often equal to in-person visits. Check your plan’s benefits or contact customer service to confirm session limits and platform requirements."
    },
    {
      question: "How many therapy sessions does my plan cover per year?",
      answer: "Coverage varies by plan—some offer 20–30 sessions annually, while others have no set limit but require pre-authorization. Check your Summary of Benefits or call your insurer. Many plans also cover annual mental health check-ins at no cost."
    },
    {
      question: "Do I need a referral from my primary doctor to see a therapist?",
      answer: "It depends on your plan. HMOs often require a referral from your PCP, while PPOs and EPOs usually allow direct access to mental health providers. Confirm your plan type and requirements through your insurer’s portal or customer service."
    },
    {
      question: "What should I do if my therapy claim is denied?",
      answer: "Review the denial letter for the reason (e.g., lack of medical necessity). Gather documentation from your therapist, such as diagnosis codes and treatment notes, and submit a formal appeal within the deadline (usually 180 days). Many insurers have a dedicated mental health appeals team."
    },
    {
      question: "What’s the difference between a psychologist, psychiatrist, and counselor?",
      answer: "A psychologist (Ph.D./Psy.D.) provides therapy and testing but cannot prescribe medication. A psychiatrist (M.D./D.O.) is a medical doctor who can diagnose, prescribe meds, and provide therapy. A counselor (LCSW, LMHC) offers talk therapy and support under licensure but doesn’t prescribe."
    },
    {
      question: "Is crisis support covered by insurance?",
      answer: "Crisis services like hotlines and mobile crisis teams are often free and not billed to insurance. However, emergency psychiatric evaluations and short-term inpatient stabilization are typically covered under your mental health benefits. Call 988 (Suicide & Crisis Lifeline) for immediate help."
    }
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div id="faq-section" className="relative min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
      
      {/* Floating Organic Elements — Like Clouds or Breath */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-10 blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-cyan-200 rounded-full opacity-8 blur-3xl animate-blob delay-1000"></div>
      <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-purple-200 rounded-full opacity-6 blur-3xl animate-blob delay-2000"></div>
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>

      {/* Main Container — Like a Soft Lantern */}
      <div className="relative z-10 max-w-4xl mx-auto backdrop-blur-xl bg-white/70 border border-white/30 rounded-3xl shadow-2xl p-8 md:p-12">
        
        {/* Title — Glowing, Ethereal */}
        <h1 className="text-center text-4xl md:text-5xl font-bold text-gray-800 mb-12 leading-tight relative">
          Most Frequently Asked Questions<br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Mental Health
          </span>
          
          {/* Subtle glowing underline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/30"></div>
        </h1>

        {/* FAQ List — Each One Feels Like a Whisper */}
        <ul className="space-y-6">
          {faqs.map((faq, index) => (
            <li key={index} className="group">
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-7 rounded-2xl border border-gray-100/50 transition-all duration-700 cursor-pointer relative overflow-hidden group-hover:border-blue-200/80 ${
                  expandedIndex === index
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 shadow-md'
                    : 'bg-white hover:bg-gray-50'
                }`}
                aria-expanded={expandedIndex === index}
              >
                {/* Question with floating glow on hover */}
                <span className="text-lg md:text-xl font-semibold text-gray-800 relative z-10 tracking-wide">
                  {faq.question}
                </span>

                {/* Animated Glow Behind Text */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

                {/* Floating Wave Animation on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-sm pointer-events-none"></div>

                {/* Arrow Icon — Gently Opens Like a Petal */}
                <svg
                  className={`absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 transition-transform duration-500 group-hover:text-blue-600 ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Answer Panel — Unfolds Like a Lotus Flower */}
              <div
                className={`overflow-hidden transition-all duration-800 ease-out ${
                  expandedIndex === index
                    ? 'max-h-[500px] opacity-100 mt-4 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100/30 shadow-inner'
                    : 'max-h-0 opacity-0 mt-0 p-0'
                }`}
              >
                <p className="text-gray-700 leading-relaxed text-base md:text-lg font-normal hyphens-auto">
                  {faq.answer}
                </p>

                {/* Subtle “breathing” animation on open */}
                <div className="mt-4 flex items-center text-xs text-gray-500 italic">
                  <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse mr-2"></span>
                  You’re not alone in this.
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Peaceful Footer CTA — Like a Whisper From the Heart */}
        <div className="mt-12 text-center pt-8 border-t border-gray-100/30">
          <p className="text-gray-600 text-lg italic leading-relaxed">
            “Healing isn’t about fixing what’s broken. It’s about remembering you were never broken to begin with.”<br />
            <span className="text-blue-600 font-medium">— Vibes Community</span>
          </p>
        </div>
      </div>

      {/* Floating Bubbles — Like Thoughts Rising */}
      <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-bounce delay-1000"></div>
      <div className="absolute top-2/5 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-15 animate-bounce delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/5 w-1 h-1 bg-purple-300 rounded-full opacity-10 animate-bounce delay-3000"></div>

      {/* CSS Animation for Floating Blobs */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default FAQSection;