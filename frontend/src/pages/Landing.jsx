import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#C05299] to-[#9b3d7a] text-white p-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold">
          Welcome to <span className="text-pink-200">GrowMind</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          Your safe space for mental wellness and growth 🌱.  
          Join communities, track your progress, talk with others, and get instant support from our chatbot.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid sm:grid-cols-3 gap-6 mt-12 text-center max-w-5xl">
        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
          <h3 className="font-semibold text-xl mb-2">🧠 Mental Health Chatbot</h3>
          <p className="text-sm text-white/70">Get emotional support anytime from our friendly assistant.</p>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
          <h3 className="font-semibold text-xl mb-2">👥 Communities</h3>
          <p className="text-sm text-white/70">Join groups, share experiences, and find people who care.</p>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
          <h3 className="font-semibold text-xl mb-2">🏆 Daily Growth</h3>
          <p className="text-sm text-white/70">Track your progress, set goals, and celebrate your wins.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 flex gap-6">
        <Link
          to="/login"
          className="px-8 py-3 bg-white text-[#C05299] font-semibold rounded-full shadow-lg hover:bg-pink-50 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 border-2 border-white font-semibold rounded-full hover:bg-white hover:text-[#C05299] transition"
        >
          Register
        </Link>
      </div>

      <footer className="mt-12 text-white/60 text-sm">
        © {new Date().getFullYear()} GrowMind. All rights reserved.
      </footer>
    </div>
  );
}
