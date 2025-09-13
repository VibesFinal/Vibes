import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 text-white text-center px-6 animate-fadeIn">
      <h1 className="text-8xl font-bold mb-4 tracking-tight" style={{ textShadow: "0 5px 15px rgba(0, 0, 0, 0.3)" }}>
        404
      </h1>
      <p className="text-xl max-w-md mb-8 opacity-95">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 border-2 border-white rounded-full font-semibold transition-all duration-300 hover:bg-white hover:text-indigo-600 transform hover:-translate-y-1 shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
}