import React from 'react';
import { Heart, Shield, Users} from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C05299]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-[#C05299] font-semibold mb-6 shadow-lg">
            
            <span>About Vibes</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            You're in a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C05299] to-purple-600">
              safe place
            </span>
          </h2>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C05299] to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">We Care</h3>
              <p className="text-gray-600">Mental health is our priority</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Safe Community</h3>
              <p className="text-gray-600">Supportive and understanding</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Shared Experience</h3>
              <p className="text-gray-600">People who understand you</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#C05299]/5 to-purple-500/5 rounded-2xl p-8 border-l-4 border-[#C05299]">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Here at <span className="font-bold text-[#C05299]">Vibes</span>, we care deeply about mental health. 
              You're in a safe place among people who face the same issues and have gone through exactly what you're 
              experiencing right now. Whatever you're feeling, you will get through it by hearing others' thoughts 
              and opinions. Don't be afraid to share your story—our community is more than welcome to hear you and 
              offer the best support so you can move forward with your life and{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C05299] to-purple-600">
                Vibe with us!
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full">
              <span className="w-2 h-2 bg-[#C05299] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-[#C05299]">Anonymous & Safe</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-purple-600">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-blue-600">Real Stories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}