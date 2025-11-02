import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

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
    <section className="text-center py-20">
      <h1
        className="text-3xl font-bold mb-2 transition-colors duration-300"
        style={{ color: isDark ? "white" : "#111827" }}
      >
        404
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        This page could not be found.
      </p>
      <Link
        to="/"
        className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
      >
        Go home
      </Link>
    </section>
  );
}
