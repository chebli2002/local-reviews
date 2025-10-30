import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white/20 backdrop-blur-md border-t border-white/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              to="/"
              className="text-xl font-bold text-indigo-700 tracking-tight"
            >

              Local<span className="text-purple-600">Reviews</span>
            </Link>
            <p className="text-sm text-gray-600">
              © {currentYear} LocalReviews. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-700">
            <Link
              to="/businesses"
              className="hover:text-indigo-600 transition-colors"
            >
              All Businesses
            </Link>
            <Link
              to="/login"
              className="hover:text-indigo-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="hover:text-indigo-600 transition-colors"
            >
              Register
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-white/30 text-center">
          <p className="text-xs text-gray-500">
            Discover and review local businesses in your area
          </p>
        </div>
      </div>
    </footer>
  );
}
