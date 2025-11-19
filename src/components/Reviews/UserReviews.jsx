import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useData } from "../../data/DataContext.jsx";

export default function UserReviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, businesses } = useData();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // ------------------------------------------
  // WATCH DARK MODE
  // ------------------------------------------
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

  // ------------------------------------------
  // LOAD REVIEWS FOR THIS USER
  // ------------------------------------------
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // DELETE POPUP STATE
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    async function fetchUserReviews() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/reviews/user/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load reviews.");

        const merged = data.map((r) => {
          const businessId =
            typeof r.business === "object" ? r.business._id : r.business;

          return {
            ...r,
            business_id: businessId,
            business: businesses.find((b) => b.id === businessId) || null,
          };
        });

        setReviews(merged);
      } catch (err) {
        setError(err.message || "Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserReviews();
  }, [id, businesses]);

  // ------------------------------------------
  // PERMISSION CHECK
  // ------------------------------------------
  const notAllowed = !currentUser || currentUser.id !== id;

  // ------------------------------------------
  // DELETE REVIEW
  // ------------------------------------------
  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `http://localhost:5000/api/reviews/${reviewToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete review.");

      // Remove from UI instantly
      setReviews((prev) => prev.filter((r) => r._id !== reviewToDelete));

      setShowConfirm(false);
      setReviewToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return (
    <section className="min-h-[90vh] flex flex-col items-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full text-center"
      >
        <h1
          className="text-4xl font-extrabold mb-2 transition-colors duration-300"
          style={{ color: isDark ? "white" : "#111827" }}
        >
          Your Reviews
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-10">
          See all the reviews you have written.
        </p>
      </motion.div>

      {notAllowed ? (
        <div className="text-center text-gray-600 dark:text-white mt-20 text-lg">
          You are not allowed to view this user's reviews.
        </div>
      ) : loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : reviews.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-8 max-w-5xl w-full"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 40px rgba(147, 197, 253, 0.25)",
              }}
              className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-border shadow-md"
            >
              <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 h-full flex flex-col justify-between transition-all duration-500">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Link
                      to={`/businesses/${r.business_id}`}
                      className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      {r.business?.name ?? "Business"}
                    </Link>

                    <div
                      className="font-medium text-lg flex items-center gap-1 transition-colors duration-300"
                      style={{ color: isDark ? "white" : "#111827" }}
                    >
                      <Star className="w-5 h-5 fill-current" />
                      {r.rating}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-4">
                    {r.comment}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 italic text-right">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/businesses/${r.business_id}/review?edit=${r._id}`
                      )
                    }
                    className="btn-outline text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setReviewToDelete(r._id);
                      setShowConfirm(true);
                    }}
                    className="btn-primary text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-md px-8 py-10 text-center max-w-lg"
        >
          You have not written any reviews yet.
        </motion.div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-sm w-full mx-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 border border-white/60 dark:border-gray-700/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete this review?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone. Are you sure you want to permanently
              delete your review?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-outline text-sm"
              >
                Cancel
              </button>

              <button onClick={handleDelete} className="btn-primary text-sm">
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
