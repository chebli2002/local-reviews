import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../data/DataContext.jsx";

export default function WriteReviewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businesses, addReview } = useData();
  const business = businesses.find((b) => b.id === id);
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

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!business)
    return (
      <div className="text-center text-gray-600 dark:text-white mt-20 text-lg">
        Business not found.
      </div>
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1 || rating > 5)
      return setError("Rating must be between 1–5.");
    if (comment.trim().length < 5)
      return setError("Please enter at least 5 characters.");

    try {
      addReview({ business_id: id, rating, comment });
      navigate(`/businesses/${id}`);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-lg p-[2px] rounded-3xl bg-gradient-border shadow-2xl"
      >
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8">
          <h1
            className="text-3xl font-extrabold mb-2 text-center transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            Write a Review
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Input */}
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

            {/* Comment Input */}
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              Submit Review
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
