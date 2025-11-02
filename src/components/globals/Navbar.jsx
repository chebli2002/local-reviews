"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../data/DataContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight"
        >
          Local
          <span className="text-purple-600 dark:text-purple-400">Reviews</span>
        </Link>

        <nav className="flex items-center gap-6 text-gray-900 dark:text-gray-100">
          <NavLink
            to="/businesses"
            className="hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            All Businesses
          </NavLink>

          {currentUser && (
            <>
              <NavLink
                to="/businesses/new"
                className="hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Add Business
              </NavLink>
              <NavLink
                to={`/users/${currentUser.id}/reviews`}
                className="hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                My Reviews
              </NavLink>
            </>
          )}

          {!currentUser ? (
            <>
              <NavLink
                to="/login"
                className="hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="hover:text-indigo-700 dark:hover:text-indigo-300"
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
              className="btn-primary px-3 py-1"
            >
              Logout ({currentUser.username})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
