"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../data/DataContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

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
        <nav className="flex items-center gap-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <NavLink
            to="/businesses"
            className="hover:text-indigo-700 dark:hover:text-pink-400 transition"
          >
            All Businesses
          </NavLink>

          {currentUser && (
            <>
              <NavLink
                to="/businesses/new"
                className="hover:text-indigo-700 dark:hover:text-pink-400 transition"
              >
                Add Business
              </NavLink>
              <NavLink
                to={`/users/${currentUser.id}/reviews`}
                className="hover:text-indigo-700 dark:hover:text-pink-400 transition"
              >
                My Reviews
              </NavLink>
            </>
          )}

          {!currentUser ? (
            <>
              <NavLink
                to="/login"
                className="hover:text-indigo-700 dark:hover:text-pink-400 transition"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="hover:text-indigo-700 dark:hover:text-pink-400 transition"
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
