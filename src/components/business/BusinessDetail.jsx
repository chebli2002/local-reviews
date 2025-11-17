import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useData } from "../../data/DataContext.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businesses, currentUser } = useData();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Watch dark mode changes (your original logic)
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

  // 🔥 Reviews loaded from backend
  const [bizReviews, setBizReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/business/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load reviews");
        }

        setBizReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err.message);
        setBizReviews([]);
      }
    }

    fetchReviews();
  }, [id]);

  // Find this business from context (which comes from backend)
  const business = businesses.find((b) => b.id === id);

  // Safely compute average rating
  const avgRating =
    bizReviews.length > 0
      ? Math.round(
          (bizReviews.reduce((sum, r) => sum + r.rating, 0) /
            bizReviews.length) *
            10
        ) / 10
      : business?.average_rating ?? 0;

  if (!business)
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600 dark:text-white">
        Business not found.
      </div>
    );

  const hasMap = !!business.google_map_url;
  const photos = business.photos || [];

  return (
    <section className="max-w-4xl mx-auto px-6 py-14 space-y-10">
      {/* Top card with name / rating / buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden p-[2px] rounded-3xl bg-gradient-border shadow-lg"
      >
        <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1
              className="text-4xl font-extrabold mb-2 tracking-tight transition-colors duration-300"
              style={{ color: isDark ? "white" : "#111827" }}
            >
              {business.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {business.address}
            </p>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">
                📞{" "}
                <span className="font-medium">{business.phone || "N/A"}</span>
              </span>
              {business.website && (
                <span className="flex items-center gap-1">
                  🌐{" "}
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    Visit Website
                  </a>
                </span>
              )}
            </div>

            <div
              className="mt-4 text-base font-semibold flex items-center gap-2 transition-colors duration-300"
              style={{ color: isDark ? "white" : "#111827" }}
            >
              <Star
                className={`w-5 h-5 fill-current ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              />
              {avgRating}
              <span className="text-gray-600 dark:text-gray-300 font-normal">
                • {bizReviews.length} reviews
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/businesses/${business.id}/review`}
              className="btn-primary text-center text-base"
            >
              Write a Review
            </Link>
            {currentUser && currentUser.id === business.owner_id && (
              <button
                onClick={() => navigate(`/businesses/${business.id}/edit`)}
                className="btn-outline text-base"
              >
                Edit Business
              </button>
            )}
          </div>

          <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-indigo-400/10 via-purple-400/20 to-pink-300/10 pointer-events-none"></div>
        </div>
      </motion.div>

      {/* About */}
      {business.description && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 border border-white/50 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-all duration-500"
        >
          <h2
            className="text-2xl font-bold mb-3 transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            About this business
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {business.description}
          </p>
        </motion.div>
      )}

      {/* Location / Google Maps */}
      {hasMap && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 border border-white/50 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-all duration-500"
        >
          <h2
            className="text-2xl font-bold mb-3 transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            Location
          </h2>
          <div className="space-y-3">
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/60 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-900">
              <iframe
                title="Google Maps"
                src={business.google_map_url}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a
              href={business.google_map_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              Open in Google Maps
            </a>
          </div>
        </motion.div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 border border-white/50 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-all duration-500"
        >
          <h2
            className="text-2xl font-bold mb-3 transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            Photos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((src, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden border border-white/60 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-900"
              >
                <img
                  src={src}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Customer Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 border border-white/50 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-all duration-500"
      >
        <h2
          className="text-2xl font-bold mb-4 transition-colors duration-300"
          style={{ color: isDark ? "white" : "#111827" }}
        >
          Customer Reviews
        </h2>

        {bizReviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {bizReviews.map((r) => (
              <li
                key={r._id || r.id}
                className="p-4 rounded-xl bg-white/60 dark:bg-gray-900/50 border border-white/30 dark:border-gray-700/40 backdrop-blur-md transition-all duration-300 hover:shadow-md"
              >
                <p className="text-gray-900 dark:text-gray-100 text-base mb-2">
                  {r.comment}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  — {r.user?.username || "Anonymous"} • {r.rating}★
                </p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </section>
  );
}
