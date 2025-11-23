import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useData } from "../../data/DataContext.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businesses, currentUser, deleteBusiness, deleteReview } = useData();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Watch dark mode changes
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

  // ----------------------------------------
  // REVIEWS (always fetched from backend)
  // ----------------------------------------
  const [bizReviews, setBizReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  async function fetchReviews() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/business/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load reviews");

      setBizReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err.message);
      setBizReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const business = businesses.find((b) => b.id === id);

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

  // ----------------------------------------
  // BUSINESS DELETE MODAL
  // ----------------------------------------
  const [showConfirmBizDelete, setShowConfirmBizDelete] = useState(false);

  const handleDeleteBusinessConfirmed = async () => {
    try {
      await deleteBusiness(business.id);
      setShowConfirmBizDelete(false);
      window.location.href = "/businesses";
    } catch (err) {
      console.error("Failed to delete business:", err.message);
      alert(err.message || "Failed to delete business");
    }
  };

  // ----------------------------------------
  // REVIEW DELETE MODAL
  // ----------------------------------------
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleDeleteReviewConfirmed = async () => {
    if (!reviewToDelete) return;

    try {
      await deleteReview(reviewToDelete);
      setReviewToDelete(null);
      await fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err.message);
      alert(err.message || "Failed to delete review");
    }
  };
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6 sm:space-y-10">
      {/* Top card with name / rating / buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden p-[2px] rounded-3xl bg-gradient-border shadow-lg"
      >
        <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 tracking-tight transition-colors duration-300 break-words"
              style={{ color: isDark ? "white" : "#111827" }}
            >
              {business.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {business.address}
            </p>

            {/* Phone + Website */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-medium">{business.phone || "N/A"}</span>
              </span>

              {business.website && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
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

            {/* Rating */}
            <div
              className="mt-4 text-base font-semibold flex items-center gap-2 transition-colors duration-300"
              style={{ color: isDark ? "white" : "#111827" }}
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  let fillClass = "text-gray-300 dark:text-gray-600";

                  if (star <= Math.floor(avgRating)) {
                    fillClass = "fill-yellow-400 text-yellow-400";
                  } else if (
                    star === Math.ceil(avgRating) &&
                    avgRating % 1 !== 0
                  ) {
                    fillClass = "text-yellow-400";
                  }

                  return (
                    <div key={star} className="relative">
                      <Star className={`w-5 h-5 ${fillClass}`} />

                      {star === Math.ceil(avgRating) && avgRating % 1 !== 0 && (
                        <div
                          className="absolute top-0 left-0 overflow-hidden"
                          style={{ width: `${(avgRating % 1) * 100}%` }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <span className="ml-1">{avgRating}</span>
              <span className="text-gray-600 dark:text-gray-300 font-normal">
                • {bizReviews.length} reviews
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
            <Link
              to={`/businesses/${business.id}/review`}
              className="btn-primary text-center text-base"
            >
              Write a Review
            </Link>

            {currentUser && currentUser.id === business.owner_id && (
              <>
                <button
                  onClick={() => navigate(`/businesses/${business.id}/edit`)}
                  className="btn-outline text-base"
                >
                  Edit Business
                </button>

                <button
                  onClick={() => setShowConfirmBizDelete(true)}
                  className="btn-outline text-base"
                >
                  Delete Business
                </button>
              </>
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

      {/* Map */}
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
              />
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
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
      {/* ----------------------------------------
          CUSTOMER REVIEWS + Edit/Delete controls
      ---------------------------------------- */}
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

        {loadingReviews ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : bizReviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {bizReviews.map((r) => (
              <li
                key={r._id}
                className="p-4 rounded-xl bg-white/60 dark:bg-gray-900/50 border border-white/30 dark:border-gray-700/40 backdrop-blur-md transition-all duration-300 hover:shadow-md"
              >
                <p className="text-gray-900 dark:text-gray-100 text-base mb-2">
                  {r.comment}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  — {r.user?.username || "Anonymous"} • {r.rating}★
                </p>

                {/* REVIEW ACTION BUTTONS */}
                {currentUser && currentUser.id === r.user?._id && (
                  <div className="flex gap-3 mt-2">
                    <Link
                      to={`/businesses/${id}/review/${r._id}/edit`}
                      className="btn-outline text-xs"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => setReviewToDelete(r._id)}
                      className="btn-outline text-xs"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* ----------------------------------------
          BUSINESS DELETE MODAL
      ---------------------------------------- */}
      {showConfirmBizDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-sm w-full mx-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 border border-white/60 dark:border-gray-700/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete this business?
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone. Are you sure you want to permanently
              delete "{business.name}" and all of its reviews?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmBizDelete(false)}
                className="btn-outline text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteBusinessConfirmed}
                className="btn-primary text-sm"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------------------------------
          REVIEW DELETE MODAL (same design)
      ---------------------------------------- */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-sm w-full mx-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 border border-white/60 dark:border-gray-700/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete this review?
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone. Are you sure you want to delete your
              review permanently?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReviewToDelete(null)}
                className="btn-outline text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteReviewConfirmed}
                className="btn-primary text-sm"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
