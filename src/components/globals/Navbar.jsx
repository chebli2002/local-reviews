import { Link, NavLink } from "react-router-dom";
import { useData } from "../data/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function Navbar() {
  const { currentUser, logout } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const navigationLinks = currentUser
    ? [
        { to: "/businesses", label: "All Businesses" },
        { to: "/my-businesses", label: "List your business" },
        { to: "/about", label: "About us" },
        { to: "/my-reviews", label: "My Reviews" },
      ]
    : [
        { to: "/businesses", label: "All Businesses" },
        { to: "/about", label: "About us" },
        { to: "/login", label: "Log in" },
        { to: "/register", label: "Register" },
      ];

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
    <nav className="sticky top-0 z-50 shadow-sm">
      <div className="relative bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border-b border-transparent dark:border-white/[0.07] px-6 sm:px-10 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text"
          >
            LocalReviews
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  twMerge(
                    "transition-colors duration-300 font-medium text-base",

                    // ACTIVE LINK COLORS
                    isActive
                      ? "text-indigo-600 dark:text-pink-300"

                      // DEFAULT LINK COLORS (MODIFIED)
                      : "text-slate-900 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-pink-300"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Logout Button */}
            {currentUser && (
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 rounded-full font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
              >
                Logout ({currentUser.username})
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-slate-900 dark:text-gray-200"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 space-y-4 pb-4"
            >
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    twMerge(
                      "block text-lg font-medium transition-colors duration-300",

                      isActive
                        ? "text-indigo-600 dark:text-pink-300"
                        : "text-slate-900 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-pink-300"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full mt-2 px-4 py-2 rounded-full font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
                >
                  Logout ({currentUser.username})
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}