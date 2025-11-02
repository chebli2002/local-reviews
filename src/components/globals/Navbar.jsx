"use client";

import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../data/DataContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();
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
    <header
      className="nav-glow fixed top-0 left-0 w-full z-50 backdrop-blur-sm 
      bg-gradient-aurora bg-aurora-overlay dark:bg-[#2a123c]/70 
      transition-all duration-700 border-b border-white/20 dark:border-purple-900/40 
      shadow-md dark:shadow-purple-900/20"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 dark:text-pink-300 tracking-tight drop-shadow-md"
        >
          Local
          <span className="text-purple-600 dark:text-purple-400">Reviews</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 transition-colors duration-300">
          <NavLink
            to="/businesses"
            className="transition-colors duration-300"
            style={{
              color: isDark ? "#F3F4F6" : "#111827",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = isDark ? "#F9A8D4" : "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = isDark ? "#F3F4F6" : "#111827";
            }}
          >
            All Businesses
          </NavLink>

          {currentUser && (
            <>
              <NavLink
                to="/businesses/new"
                className="transition-colors duration-300"
                style={{
                  color: isDark ? "#F3F4F6" : "#111827",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = isDark ? "#F9A8D4" : "#4F46E5";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isDark ? "#F3F4F6" : "#111827";
                }}
              >
                Add Business
              </NavLink>
              <NavLink
                to={`/users/${currentUser.id}/reviews`}
                className="transition-colors duration-300"
                style={{
                  color: isDark ? "#F3F4F6" : "#111827",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = isDark ? "#F9A8D4" : "#4F46E5";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isDark ? "#F3F4F6" : "#111827";
                }}
              >
                My Reviews
              </NavLink>
            </>
          )}

          {!currentUser ? (
            <>
              <NavLink
                to="/login"
                className="transition-colors duration-300"
                style={{
                  color: isDark ? "#F3F4F6" : "#111827",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = isDark ? "#F9A8D4" : "#4F46E5";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isDark ? "#F3F4F6" : "#111827";
                }}
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="transition-colors duration-300"
                style={{
                  color: isDark ? "#F3F4F6" : "#111827",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = isDark ? "#F9A8D4" : "#4F46E5";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isDark ? "#F3F4F6" : "#111827";
                }}
              >
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="btn-primary px-3 py-1 text-sm shadow-sm"
            >
              Logout ({currentUser.username})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
