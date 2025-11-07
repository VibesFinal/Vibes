import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MessageCircle, Users, Target, Brain, Heart, TrendingUp, Play, Shield, Sparkles } from "lucide-react";
import logo from "../components/images/v_logo.png";
import About from "./About";

export default function Landing() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const VideoDemo = ({ title, videoSrc, gradient, delay }) => (
    <div
      className={`transition-all duration-1000 transform ${
        isVisible[`section-${title}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative group">
        <div className={`aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200`}>
          {videoSrc ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <div className="text-white text-center p-8">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-60" />
                <p className="text-lg font-semibold">Video Coming Soon</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl group-hover:w-40 group-hover:h-40 transition-all duration-500" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Logo"
                className="h-9 w-9 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 ml-[135px]">
              <a 
                href="#features" 
                onClick={(e) => handleScrollToSection(e, 'features')}
                className="text-gray-700 hover:text-[#C05299] transition-colors cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => handleScrollToSection(e, 'testimonials')}
                className="text-gray-700 hover:text-[#C05299] transition-colors cursor-pointer"
              >
                Testimonials
              </a>
              <a 
                href="#about" 
                onClick={(e) => handleScrollToSection(e, 'about')}
                className="text-gray-700 hover:text-[#C05299] transition-colors cursor-pointer"
              >
                About
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#C05299] transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-[#C05299] text-white font-semibold rounded-lg hover:bg-[#9b3d7a] transition-all shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsVisible(prev => ({ ...prev, mobileMenu: !prev.mobileMenu }))}
              className="md:hidden p-2 text-gray-700 hover:text-[#C05299] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isVisible.mobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isVisible.mobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
              <a 
                href="#features" 
                onClick={(e) => {
                  handleScrollToSection(e, 'features');
                  setIsVisible(prev => ({ ...prev, mobileMenu: false }));
                }}
                className="block text-gray-700 hover:text-[#C05299] transition-colors cursor-pointer py-2"
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => {
                  handleScrollToSection(e, 'testimonials');
                  setIsVisible(prev => ({ ...prev, mobileMenu: false }));
                }}
                className="block text-gray-700 hover:text-[#C05299] transition-colors cursor-pointer py-2"
              >
                Testimonials
              </a>
              <a 
                href="#about" 
                onClick={(e) => {
                  handleScrollToSection(e, 'about');
                  setIsVisible(prev => ({ ...prev, mobileMenu: false }));
                }}
                className="block text-gray-700 hover:text-[#C05299] transition-colors cursor-pointer py-2"
              >
                About
              </a>
              <div className="pt-4 space-y-3 border-t border-gray-100">
                <Link
                  to="/login"
                  className="block text-center py-2.5 text-gray-700 hover:text-[#C05299] transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-6 py-2.5 bg-[#C05299] text-white font-semibold rounded-lg hover:bg-[#9b3d7a] transition-all shadow-lg shadow-pink-500/30"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Introducing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C05299] to-[#9b3d7a]">
                Vibes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join a community where you can talk about your problems, and find solutions by hearing other people opinions
            </p>

            {/* Hero Image/Mockup */}
            <div className="relative max-w-5xl mx-auto animate-fade-in-delay-2">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                    <Brain className="w-12 h-12 text-[#C05299] mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">AI Support</h4>
                    <p className="text-sm text-gray-600">emotional guidance</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                    <Users className="w-12 h-12 text-[#C05299] mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Communities</h4>
                    <p className="text-sm text-gray-600">Find your tribe and talk with people who have the same thoughts</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-xl">
                    <Target className="w-12 h-12 text-[#C05299] mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Talk with real therapists</h4>
                    <p className="text-sm text-gray-600">Talk with a real therapist to get support</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections with Video Demos */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Feature 1 */}
          <div id="section-chatbot" className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-pink-100 text-[#C05299] rounded-full text-sm font-semibold uppercase tracking-wide">
                AI-Powered Support
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Your companion, always there
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get instant emotional support from our empathetic AI chatbot. Available 24/7 to listen, guide, and help you through any moment.
              </p>
            </div>
            <VideoDemo
              title="chatbot"
              videoSrc="/icon/Videos/chatbotSpeed.mp4"
              gradient="from-violet-400 via-purple-500 to-pink-500"
              delay={0}
            />
          </div>

          {/* Feature 2 */}
          <div id="section-community" className="grid md:grid-cols-2 gap-16 items-center">
            <VideoDemo
              title="community"
              videoSrc="/icon/Videos/communitiesFinal.mp4"
              gradient="from-blue-400 via-indigo-500 to-purple-500"
              delay={100}
            />
            <div className="space-y-6 md:order-first">
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold uppercase tracking-wide">
                Connect & Share
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Find your community
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join supportive groups where you can share experiences, find understanding, and connect with people who truly care.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div id="section-tracking" className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold uppercase tracking-wide">
                Posting
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Share your thoughts
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Share your thoughts with people, and see other people opinions and experience
              </p>
            </div>
            <VideoDemo
              title="tracking"
              videoSrc="/icon/Videos/postingFinal.mp4"
              gradient="from-emerald-400 via-teal-500 to-cyan-500"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* About section */}
      <About />

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Stories that inspire us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Vibes helped me find hope again. The community is so supportive and understanding.", author: "Sarah" },
              { quote: "The chatbot feels like talking to a friend. It's there whenever I need it most.", author: "Hamzeh" },
              { quote: "Seeing my mental analysis really helped me to understand my emotions, This app changed my life.", author: "Omar" }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 text-lg">"{testimonial.quote}"</p>
                <p className="font-semibold text-[#C05299]">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Start your journey today
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands who chose mental wellness. It's free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-4 bg-[#C05299] text-white font-bold rounded-xl hover:bg-[#9b3d7a] transition-all shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 hover:-translate-y-1 text-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 border-2 border-[#C05299] text-[#C05299] font-bold rounded-xl hover:bg-[#C05299] hover:text-white transition-all text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img
            src={logo}
            alt="Logo"
            className="h-9 w-9 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 object-contain"
          />
          <span className="text-xl font-bold">Vibes</span>
        </div>
        <p className="text-gray-400">© {new Date().getFullYear()} Vibes. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s backwards;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s backwards;
        }
      `}</style>
    </div>
  );
}