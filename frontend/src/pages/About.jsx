import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B8E986] via-[#9FD6E2] to-[#DCC6A0] p-6 relative overflow-hidden">
      {/* Enhanced background with all colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B8E986]/30 via-[#73C174]/20 to-[#9FD6E2]/25"></div>
        
        {/* Animated floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#B8E986]/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#73C174]/15 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#9FD6E2]/25 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-[#DCC6A0]/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-[#73C174]/10 rounded-3xl rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-[#B8E986]/10 rounded-2xl -rotate-12"></div>
        <div className="absolute top-40 right-40 w-16 h-16 border-4 border-[#DCC6A0]/10 rounded-xl rotate-30"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-4xl relative z-10">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#73C174] to-[#B8E986] rounded-3xl shadow-2xl shadow-[#73C174]/30 mb-8 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#73C174] via-[#B8E986] to-[#9FD6E2]">Mindful Space</span>
          </h1>
          <p className="text-gray-700 text-xl font-light">Your safe haven for mental wellness and personal growth</p>
        </div>

        {/* Main content card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/10 border border-white/40 overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:shadow-[#73C174]/20">
          {/* Gradient progress bar */}
          <div className="h-2 bg-gradient-to-r from-[#B8E986] via-[#73C174] to-[#9FD6E2]"></div>
          
          <div className="p-12">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-2xl mb-10 font-light tracking-wide text-center">
                <span className="inline-block text-6xl font-black bg-gradient-to-br from-[#B8E986] to-[#73C174] bg-clip-text text-transparent mr-3 align-top leading-none mt-1">H</span>
                ere in our community, we prioritize mental health and create a supportive environment where everyone's journey is valued and respected.
              </p>

              <div className="grid md:grid-cols-2 gap-10 mb-12">
                <div className="space-y-8">
                  <div className="flex items-start gap-5 p-6 bg-gradient-to-br from-white to-[#F0F0F0] rounded-2xl border border-[#B8E986]/20 hover:border-[#73C174]/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#B8E986] to-[#73C174] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#B8E986]/30">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 text-lg">Community Support</h3>
                      <p className="text-gray-600">Connect with others who understand your journey and share similar experiences in a warm, welcoming space.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-6 bg-gradient-to-br from-white to-[#F0F0F0] rounded-2xl border border-[#9FD6E2]/20 hover:border-[#9FD6E2]/40 transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#9FD6E2] to-[#DCC6A0] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#9FD6E2]/30">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 text-lg">Safe Environment</h3>
                      <p className="text-gray-600">Share your story in a judgment-free space where privacy, respect, and understanding are our top priorities.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-5 p-6 bg-gradient-to-br from-white to-[#F0F0F0] rounded-2xl border border-[#73C174]/20 hover:border-[#B8E986]/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#73C174] to-[#B8E986] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#73C174]/30">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 text-lg">Emotional Wellness</h3>
                      <p className="text-gray-600">Focus on your mental health with personalized tools and compassionate support designed for your unique wellbeing journey.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-6 bg-gradient-to-br from-white to-[#F0F0F0] rounded-2xl border border-[#DCC6A0]/20 hover:border-[#9FD6E2]/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#DCC6A0] to-[#9FD6E2] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#DCC6A0]/30">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 text-lg">Growth & Healing</h3>
                      <p className="text-gray-600">Move forward with your life while receiving the ongoing support and guidance you need to not just survive, but truly thrive.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspiration box */}
              <div className="text-center p-8 bg-gradient-to-r from-[#F0F0F0] to-white rounded-2xl border border-[#73C174]/20 shadow-lg">
                <p className="text-xl text-gray-700 font-medium leading-relaxed">
                  Remember: Everything you feel right now is temporary. You have the strength to get through this, 
                  and our community is here to help you{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#73C174] to-[#B8E986]">
                    move forward and thrive
                  </span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-10">
          <button className="px-10 py-5 bg-gradient-to-r from-[#73C174] to-[#B8E986] text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-[#73C174]/40 hover:shadow-[#73C174]/60">
            Join Our Community Today
          </button>
          <p className="text-gray-600 text-base mt-5 font-medium">
            Start your journey to better mental health and personal growth
          </p>
        </div>
      </div>
    </div>
  );
}