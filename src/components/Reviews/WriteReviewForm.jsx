import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../data/DataContext.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function WriteReviewForm() {
  const { id } = useParams(); // business id
  const [searchParams] = useSearchParams();
  const editReviewId = searchParams.get("edit"); // if exists -> edit mode

  const navigate = useNavigate();
  const { businesses, currentUser } = useData();

  const business = businesses.find((b) => b.id === id);

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

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // ---------------------------------------------
  // LOAD EXISTING REVIEW IF IN EDIT MODE
  // ---------------------------------------------
  useEffect(() => {
    async function loadExistingReview() {
      if (!editReviewId) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/reviews/user/${currentUser.id}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        const found = data.find((r) => r._id === editReviewId);
        if (!found) return;

        setRating(found.rating);
        setComment(found.comment);
      } catch (err) {
        console.error("Failed to load review:", err);
      }
    }

    if (currentUser) loadExistingReview();
  }, [editReviewId, currentUser]);

  if (!business)
    return (
      <div className="text-center text-gray-600 dark:text-white mt-20 text-lg">
        Business not found.
      </div>
    );

  // ---------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1 || rating > 5)
      return setError("Rating must be between 1–5.");
    if (comment.trim().length < 5)
      return setError("Please enter at least 5 characters.");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("You must be logged in.");

      let url = `${API_BASE_URL}/api/reviews`;
      let method = "POST";
      let body = {
        business_id: id,
        rating,
        comment,
      };

      if (editReviewId) {
        // EDIT MODE
        url = `${API_BASE_URL}/api/reviews/${editReviewId}`;
        method = "PUT";
        body = { rating, comment }; // backend ONLY accepts these for editing
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review.");

      // Go back to business page
      navigate(`/businesses/${id}`);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-lg p-[2px] rounded-3xl bg-gradient-border shadow-2xl"
      >
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8">
          <h1
            className="text-2xl sm:text-3xl font-extrabold mb-2 text-center transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            {editReviewId ? "Edit Review" : "Write a Review"}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 text-center text-sm sm:text-base break-words">
            for{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {business.name}
            </span>
          </p>

          {error && (
            <div className="text-red-600 bg-red-100 border border-red-200 px-3 py-2 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Rating */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <motion.button
                    key={num}
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(num)}
                    className={`text-2xl transition-colors ${
                      rating >= num
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Share your experience..."
                rows={5}
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              {editReviewId ? "Update Review" : "Submit Review"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
