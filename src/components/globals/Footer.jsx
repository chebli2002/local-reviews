import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // 🌓 Watch for dark mode toggle dynamically
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="mt-auto bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border-t border-white/40 dark:border-gray-700/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight transition-colors duration-300"
              style={{
                color: isDark ? "#D8B4FE" : "#4F46E5",
              }}
            >
              Local
              <span
                style={{
                  color: isDark ? "#C084FC" : "#9333EA",
                }}
              >
                Reviews
              </span>
            </Link>
            <p
              className="text-sm transition-colors duration-300"
              style={{
                color: isDark ? "#D1D5DB" : "#4B5563",
              }}
            >
              © {currentYear} LocalReviews. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link
              to="/businesses"
              className="transition-colors duration-300"
              style={{
                color: isDark ? "#E5E7EB" : "#374151",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isDark ? "#F3F4F6" : "#4F46E5";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isDark ? "#E5E7EB" : "#374151";
              }}
            >
              All Businesses
            </Link>
            <Link
              to="/login"
              className="transition-colors duration-300"
              style={{
                color: isDark ? "#E5E7EB" : "#374151",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isDark ? "#F3F4F6" : "#4F46E5";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isDark ? "#E5E7EB" : "#374151";
              }}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="transition-colors duration-300"
              style={{
                color: isDark ? "#E5E7EB" : "#374151",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isDark ? "#F3F4F6" : "#4F46E5";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isDark ? "#E5E7EB" : "#374151";
              }}
            >
              Register
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-white/30 dark:border-gray-700/30 text-center">
          <p
            className="text-xs transition-colors duration-300"
            style={{
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}
          >
            Discover and review local businesses in your area
          </p>
        </div>
      </div>
    </footer>
  );
}
