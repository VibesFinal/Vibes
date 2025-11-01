import React, { useState } from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "What are the most common signs of mental health issues?",
      answer: "Common signs include persistent sadness or anxiety, extreme mood swings, social withdrawal, changes in eating or sleeping patterns, difficulty concentrating, excessive fear or worry, and loss of interest in activities you once enjoyed. If these symptoms persist for more than two weeks and interfere with daily life, it's important to seek professional support."
    },
    {
      question: "How can I tell the difference between normal stress and anxiety?",
      answer: "Normal stress is typically tied to specific situations and subsides when the situation resolves. Anxiety often persists without a clear cause, involves excessive worry about everyday situations, and may include physical symptoms like rapid heartbeat, sweating, or panic attacks. While stress is a response to pressure, anxiety is characterized by persistent and excessive worry that doesn't go away even in the absence of a stressor."
    },
    {
      question: "What are effective coping strategies for depression?",
      answer: "Effective strategies include maintaining a routine, regular physical activity, connecting with supportive people, practicing mindfulness, setting small achievable goals, limiting isolation, and seeking professional therapy. Cognitive Behavioral Therapy (CBT) has shown particular effectiveness. Remember that depression is treatable, and different strategies work for different people."
    },
    {
      question: "Can exercise really help with mental health?",
      answer: "Yes, exercise releases endorphins and other 'feel-good' chemicals in the brain, reduces stress hormones, improves sleep quality, and boosts self-esteem. Regular physical activity can be as effective as medication for mild to moderate depression. Even 30 minutes of moderate exercise 3-5 times per week can significantly improve mental wellbeing."
    },
    {
      question: "How does social media affect mental health?",
      answer: "Social media can both positively and negatively impact mental health. While it provides connection and support, excessive use is linked to increased anxiety, depression, loneliness, and poor body image. Setting boundaries, taking regular breaks, curating your feed positively, and focusing on real-life connections can help maintain healthy social media habits."
    },
    {
      question: "What's the difference between feeling sad and clinical depression?",
      answer: "Sadness is a normal human emotion triggered by specific events, usually temporary, and doesn't typically impair overall functioning. Clinical depression is a medical condition lasting at least two weeks, involving persistent feelings of hopelessness, loss of interest in activities, changes in appetite or sleep, and significant impairment in daily functioning. Depression often occurs without an obvious trigger."
    },
    {
      question: "How can I support someone with anxiety?",
      answer: "Be patient and listen without judgment, validate their feelings rather than minimizing them, help them practice grounding techniques during anxiety attacks, encourage professional help without pressure, and educate yourself about anxiety disorders. Avoid telling them to 'just relax' or 'calm down,' as this can increase feelings of frustration and isolation."
    },
    {
      question: "What are panic attacks and how can I manage them?",
      answer: "Panic attacks are sudden episodes of intense fear that trigger severe physical reactions without real danger. Symptoms include racing heart, sweating, trembling, shortness of breath, and fear of losing control. Management techniques include deep breathing, grounding exercises (5-4-3-2-1 method), mindfulness, and progressive muscle relaxation. Regular therapy can help reduce their frequency and intensity."
    },
    {
      question: "How important is sleep for mental health?",
      answer: "Extremely important. Sleep allows the brain to process emotions, consolidate memories, and restore chemical balance. Chronic sleep deprivation increases risk for depression, anxiety, and mood disorders. Most adults need 7-9 hours of quality sleep per night. Maintaining a consistent sleep schedule and good sleep hygiene are crucial for mental wellness."
    },
    {
      question: "What are some daily habits that support good mental health?",
      answer: "Key habits include maintaining a consistent routine, practicing gratitude, staying physically active, connecting with others, setting boundaries, taking breaks from technology, getting sunlight exposure, eating nutritious meals, and engaging in activities that bring joy and meaning. Small, consistent practices build resilience over time."
    },
    {
      question: "When should someone consider medication for mental health?",
      answer: "Medication may be considered when symptoms significantly impair daily functioning, when therapy alone hasn't provided sufficient relief, for moderate to severe conditions, or when there's a chemical imbalance. It's most effective when combined with therapy. This decision should be made with a psychiatrist who can evaluate individual needs and monitor progress."
    },
    {
      question: "How can I build mental resilience?",
      answer: "Build resilience by developing strong social connections, practicing self-compassion, maintaining realistic optimism, embracing flexibility in thinking, setting healthy boundaries, learning stress management techniques, and viewing challenges as opportunities for growth. Resilience isn't about avoiding difficulties but developing the capacity to navigate them effectively."
    }
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div id="faq-section" className="relative min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-pink-50 overflow-hidden">
      
      {/* Modern Geometric Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#C05299] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C05299] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#C05299] opacity-3 rounded-full blur-3xl"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(192,82,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,82,153,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl shadow-2xl shadow-[#C05299]/10 p-8 md:p-12">
        
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-3 h-3 bg-[#C05299] rounded-full mr-3"></div>
            <span className="text-sm font-semibold text-[#C05299] uppercase tracking-wider">Mental Health Education</span>
            <div className="w-3 h-3 bg-[#C05299] rounded-full ml-3"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Mental Health
            <br />
            <span className="text-[#C05299] relative">
              FAQs
              <div className="absolute bottom-2 left-0 w-full h-3 bg-[#C05299]/10 -z-10 rounded-lg"></div>
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Understanding mental health, recognizing symptoms, and finding pathways to wellness.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden border ${
                  expandedIndex === index
                    ? 'bg-white border-[#C05299]/20 shadow-lg shadow-[#C05299]/5'
                    : 'bg-white/50 border-gray-100 hover:border-[#C05299]/30 hover:bg-white/80 hover:shadow-md'
                }`}
                aria-expanded={expandedIndex === index}
              >
                {/* Question */}
                <div className="flex items-start justify-between">
                  <span className={`text-lg md:text-xl font-semibold pr-12 leading-relaxed ${
                    expandedIndex === index ? 'text-gray-900' : 'text-gray-800'
                  }`}>
                    {faq.question}
                  </span>
                  
                  {/* Modern Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    expandedIndex === index 
                      ? 'bg-[#C05299] text-white rotate-180' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-[#C05299] group-hover:text-white'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Active State Indicator */}
                {expandedIndex === index && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#C05299] to-pink-400"></div>
                )}
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-700 ease-out ${
                  expandedIndex === index
                    ? 'max-h-[500px] opacity-100 mt-2'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pl-8 bg-gradient-to-r from-gray-50/50 to-white/30 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg font-normal">
                    {faq.answer}
                  </p>
                  
                  {/* Supportive Note */}
                  <div className="flex items-center mt-4 text-sm text-[#C05299] font-medium">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Understanding is the first step toward healing
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center pt-8 border-t border-gray-200/50">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-[#C05299] rounded-full mr-2"></div>
            <div className="w-2 h-2 bg-[#C05299] rounded-full mr-2"></div>
            <div className="w-2 h-2 bg-[#C05299] rounded-full"></div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
            "Mental health is not a destination, but a process. It's about how you drive, not where you're going."
          </p>
          
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-[#C05299] rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-[#C05299] rounded-full opacity-15 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#C05299] rounded-full opacity-10 animate-pulse delay-2000"></div>
    </div>
  );
};

export default FAQSection;