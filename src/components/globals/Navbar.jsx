"use client";

import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../data/DataContext.jsx";
import { twMerge } from "tailwind-merge";

export default function Navbar() {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Watch for dark mode toggle dynamically
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const alwaysVisibleLinks = [
    { to: "/businesses", label: "All Businesses" },
    { to: "/my-businesses", label: "List your business" },
    { to: "/about", label: "About us" },
  ];

  const authDependentLinks = currentUser
    ? [{ to: `/users/${currentUser.id}/reviews`, label: "My Reviews" }]
    : [
        { to: "/login", label: "Log in" },
        { to: "/register", label: "Register" },
      ];

  const navigationLinks = [...alwaysVisibleLinks, ...authDependentLinks];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          className="text-2xl font-bold tracking-tight drop-shadow-md transition-colors duration-300"
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

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6 transition-colors duration-300"
            aria-label="Primary navigation"
          >
            {navigationLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {({ isActive }) => (
                  <span
                    className={twMerge(
                      "transition-colors duration-300 font-medium text-base"
                    )}
                    style={{
                      color: isDark
                        ? isActive
                          ? "#F9A8FF" // dark active: pink-ish
                          : "#FFFFFF" // dark default: white
                        : isActive
                        ? "#4F46E5" // light active: indigo
                        : "#111827", // light default: near-black
                    }}
                  >
                    {link.label}
                  </span>
                )}
              </NavLink>
            ))}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="btn-primary px-3 py-1 text-sm shadow-sm"
              >
                Logout ({currentUser.username})
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-white/40 dark:border-purple-900/50 p-2 text-slate-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-purple-900/30 transition-all duration-300"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Open main menu</span>
            <span className="relative flex flex-col gap-1.5">
              <span
                className={`h-0.5 w-6 bg-current transition-transform duration-300 ${
                  isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-current transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-current transition-transform duration-300 ${
                  isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        className={`lg:hidden overflow-hidden border-t border-white/20 dark:border-purple-900/40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg transition-[max-height] duration-300 ${
          isMenuOpen ? "max-h-[480px]" : "max-h-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {navigationLinks.map((link) => (
            <NavLink key={`mobile-${link.to}`} to={link.to}>
              {({ isActive }) => (
                <span
                  className={twMerge(
                    "transition-colors duration-300 font-medium text-lg"
                  )}
                  style={{
                    color: isDark
                      ? isActive
                        ? "#F9A8FF"
                        : "#FFFFFF"
                      : isActive
                      ? "#4F46E5"
                      : "#111827",
                  }}
                >
                  {link.label}
                </span>
              )}
            </NavLink>
          ))}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="btn-primary w-full px-4 py-2 text-sm shadow-sm"
            >
              Logout ({currentUser.username})
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
