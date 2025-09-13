import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-3xl bg-white border-2 border-blue-300 rounded-2xl p-10 shadow-lg shadow-blue-200/30 text-center">
        <p className="text-lg leading-relaxed text-gray-800 font-normal font-sans">
          <span className="text-4xl font-bold text-blue-400 mt-1">H</span>
          ere in Vibes, we care about mental health. Don't worry — you are in a safe place among people who face the same issues and have gone through exactly what you're facing right now. Everything you feel right now, you will get through — especially when you hear others’ thoughts and opinions. Don't be afraid to share your story; they will be more than welcome to listen and offer you the best help so you can move on with your life and vibe with us!
        </p>
      </div>
    </div>
  );
}