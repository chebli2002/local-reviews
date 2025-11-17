import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useData } from "../../data/DataContext.jsx";

export default function UserReviews() {
  const { id } = useParams();
  const { users, businesses } = useData();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // 🔐 backend-powered reviews
  const [backendReviews, setBackendReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // watch dark mode changes (your original code)
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

  const user = users.find((u) => u.id === id);

  // 🔄 load reviews for this user from backend
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/reviews/user/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load reviews");
        }

        // attach business info so the JSX can use r.business?.name
        const merged = data.map((r) => {
          const businessId =
            typeof r.business === "object" && r.business !== null
              ? r.business._id
              : r.business;

          return {
            ...r,
            business_id: businessId,
            business:
              businesses.find((b) => b.id === businessId) ?? r.business ?? null,
          };
        });

        setBackendReviews(merged);
      } catch (err) {
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [id, user, businesses]);

  // The JSX below uses this `reviews` array.
  const reviews = backendReviews;

  if (!user)
    return (
      <div className="text-center text-gray-600 dark:text-white mt-20 text-lg">
        User not found.
      </div>
    );

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
          Reviews by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {user.username}
          </span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-10">
          See what {user.username} thinks about local businesses.
        </p>
      </motion.div>

      {reviews.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-8 max-w-5xl w-full"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={r._id || r.id}
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
              <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 h-full flex flex-col justify-between hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500">
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
                    <Star
                      className={`w-5 h-5 fill-current ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    />
                    {r.rating}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-4">
                  {r.comment}
                </p>

                <div className="text-sm text-gray-500 dark:text-gray-400 italic text-right">
                  {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-md px-8 py-10 text-center max-w-lg"
        >
          No reviews yet. Start sharing your experiences!
        </motion.div>
      )}
    </section>
  );
}
