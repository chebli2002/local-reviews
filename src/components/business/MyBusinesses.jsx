import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import RatingStars from "./RatingStars.jsx";
import { useData } from "../../data/DataContext.jsx";

export default function MyBusinesses() {
  const { businesses, currentUser, deleteBusiness } = useData();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [term, setTerm] = useState("");
  const [confirmBusiness, setConfirmBusiness] = useState(null);

  // Watch dark mode changes (same pattern as other pages)
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

  if (!currentUser) {
    // Route is protected, but this keeps things safe
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600 dark:text-white">
        Please log in to see your businesses.
      </div>
    );
  }

  const owned = businesses.filter((b) => b.owner_id === currentUser.id);

  const filtered = owned.filter(
    (b) =>
      term.trim() === "" ||
      [b.name, b.description, b.address]
        .join(" ")
        .toLowerCase()
        .includes(term.toLowerCase())
  );

  const handleConfirmDelete = async () => {
    if (!confirmBusiness) return;
    try {
      await deleteBusiness(confirmBusiness.id);
      setConfirmBusiness(null);
    } catch (err) {
      console.error("Failed to delete business:", err.message);
      alert(err.message || "Failed to delete business");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14 space-y-12 text-gray-900 dark:text-white">
      {/* Title */}
      <h1
        className="text-4xl font-extrabold text-center tracking-tight mb-6 transition-colors duration-500"
        style={{
          color: isDark ? "white" : "#111827",
        }}
      >
        My Businesses
      </h1>

      {/* Small search just for your own businesses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-xl mx-auto p-[2px] rounded-3xl bg-gradient-border shadow-lg"
      >
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-4 md:p-5 border border-white/40 dark:border-gray-700/40 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none transition-colors ${
                isDark ? "text-white" : "text-gray-700"
              }`}
            />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search within your businesses..."
              className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
          <button
            onClick={() => navigate("/businesses/new")}
            className="btn-primary px-4 py-2 text-sm"
          >
            + Add Business
          </button>
        </div>
      </motion.div>

      {/* If user has no businesses */}
      {owned.length === 0 && (
        <div className="text-center py-16 max-w-xl mx-auto">
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              color: isDark ? "white" : "#111827",
            }}
          >
            You haven’t added any businesses yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first business to start collecting reviews from the
            community.
          </p>
          <button
            onClick={() => navigate("/businesses/new")}
            className="btn-primary px-6 py-2"
          >
            Add a Business
          </button>
        </div>
      )}

      {/* Business cards (only if user owns some) */}
      {owned.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.length > 0 ? (
            filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 60px rgba(147, 197, 253, 0.4)",
                }}
                className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-border"
              >
                <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-white/85 dark:hover:bg-gray-800/85 transition-all duration-500 shadow-lg hover:shadow-2xl md:h-40">
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <Link
                      to={`/businesses/${b.id}`}
                      className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {b.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {b.address}
                    </p>

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <RatingStars
                        rating={b.average_rating}
                        size={16}
                        className="text-gray-900 dark:text-white"
                      />
                      {b.review_count > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                          {b.review_count}{" "}
                          {b.review_count === 1 ? "review" : "reviews"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 items-center flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => navigate(`/businesses/${b.id}/edit`)}
                        className="btn-outline px-4 py-2"
                      >
                        Edit
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => setConfirmBusiness(b)}
                        className="btn-outline px-4 py-2"
                      >
                        Delete
                      </button>
                    </motion.div>
                  </div>

                  {/* Business Image - Far Right */}
                  {b.photos && b.photos.length > 0 ? (
                    <div className="hidden md:block w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-white/60 dark:border-gray-700/60">
                      <img
                        src={b.photos[0]}
                        alt={b.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="hidden md:block w-32 h-32 flex-shrink-0"></div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 md:col-span-2">
              <p className="text-gray-600 dark:text-gray-400">
                No businesses match your search.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-sm w-full mx-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 border border-white/60 dark:border-gray-700/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete this business?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone. Are you sure you want to permanently
              delete "{confirmBusiness.name}" and all of its reviews?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmBusiness(null)}
                className="btn-outline text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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
