import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useData } from "../../data/DataContext.jsx";

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businesses, reviews, users, currentUser } = useData();
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

  const business = businesses.find((b) => b.id === id);
  const bizReviews = reviews
    .filter((r) => r.business_id === id)
    .map((r) => ({
      ...r,
      user: users.find((u) => u.id === r.user_id),
    }))
    .sort((a, b) => b.id.localeCompare(a.id));

  if (!business)
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600 dark:text-white">
        Business not found.
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto px-6 py-14 space-y-10">
      {/* HEADER CARD */}
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
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{business.address}</p>

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
              {business.average_rating}
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
            {currentUser && (
              <button
                onClick={() => navigate(`/businesses/${business.id}/edit`)}
                className="btn-outline text-base"
              >
                Edit Business
              </button>
            )}
          </div>

          {/* Accent gradient overlay */}
          <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-indigo-400/10 via-purple-400/20 to-pink-300/10 pointer-events-none"></div>
        </div>
      </motion.div>

      {/* ABOUT SECTION */}
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

      {/* REVIEWS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-5"
      >
        <h2
          className="text-3xl font-extrabold mb-4 transition-colors duration-300"
          style={{ color: isDark ? "white" : "#111827" }}
        >
          Reviews
        </h2>

        {bizReviews.length > 0 ? (
          <div className="space-y-5">
            {bizReviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative overflow-hidden p-[2px] rounded-3xl bg-gradient-border"
              >
                <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div
                        className="font-semibold text-lg transition-colors duration-300"
                        style={{ color: isDark ? "white" : "#111827" }}
                      >
                        {r.user?.username ?? "Anonymous"}
                      </div>
                      <div
                        className="text-sm font-medium flex items-center gap-1 transition-colors duration-300"
                        style={{ color: isDark ? "white" : "#111827" }}
                      >
                        <Star
                          className={`w-4 h-4 fill-current ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        />
                        {r.rating} / 5
                      </div>
                    </div>
                    <div className="text-gray-400 dark:text-gray-500 text-xs">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {r.comment}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 text-gray-600 dark:text-gray-300 text-center text-lg border border-white/50 dark:border-gray-700/50">
            No reviews yet. Be the first to share your thoughts!
          </div>
        )}
      </motion.div>
    </section>
  );
}
