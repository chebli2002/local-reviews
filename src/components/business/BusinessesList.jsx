import { Link, useLocation } from "react-router-dom";
import { useData } from "../../data/DataContext.jsx";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import RatingStars from "./RatingStars.jsx";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BusinessesList() {
  const { businesses, categories, currentUser, deleteBusiness } = useData();
  const qs = useQuery();

  const [term, setTerm] = useState(qs.get("q") || "");
  const [cat, setCat] = useState(qs.get("category") || "all");
  const [sort, setSort] = useState("rating");
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // store the FULL business object for the confirmation modal
  const [confirmBusiness, setConfirmBusiness] = useState(null);

  // 🌓 Watch for dark mode toggle dynamically
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

  const filtered = businesses
    .filter(
      (b) =>
        (cat === "all" || b.category_id === cat) &&
        (term.trim() === "" ||
          [b.name, b.description, b.address]
            .join(" ")
            .toLowerCase()
            .includes(term.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "rating") return b.average_rating - a.average_rating;
      if (sort === "reviews") return b.review_count - a.review_count;
      return a.name.localeCompare(b.name);
    });

  const handleConfirmDelete = async () => {
    if (!confirmBusiness) return;
    try {
      await deleteBusiness(confirmBusiness.id);
      setConfirmBusiness(null);
      // 🔁 hard reload so the list is rebuilt from fresh state
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete business:", err.message);
      alert(err.message || "Failed to delete business");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14 space-y-12 text-gray-900 dark:text-white">
      {/* Title that switches color */}
      <h1
        className="text-4xl font-extrabold text-center tracking-tight mb-6 transition-colors duration-500"
        style={{
          color: isDark ? "white" : "#111827",
        }}
      >
        All Businesses
      </h1>

      {/* 🌸 Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative p-[2px] rounded-3xl bg-gradient-border shadow-lg"
      >
        <div className="grid sm:grid-cols-4 gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/40 dark:border-gray-700/40">
          <div className="col-span-2 relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none transition-colors ${
                isDark ? "text-white" : "text-gray-700"
              }`}
            />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full rounded-xl pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-xl px-3 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 text-gray-800 dark:text-white outline-none transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl px-3 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 text-gray-800 dark:text-white outline-none transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <option value="rating">Sort: Rating</option>
            <option value="reviews">Sort: Reviews</option>
            <option value="name">Sort: A–Z</option>
          </select>
        </div>
      </motion.div>

      {/* Filter Chips */}
      {(term || cat !== "all" || sort !== "rating") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Active filters:
          </span>
          {term && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTerm("")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
            >
              Search: "{term}"
              <X className="w-3 h-3" />
            </motion.button>
          )}
          {cat !== "all" && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCat("all")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
            >
              {categories.find((c) => c.id === cat)?.name || "Category"}
              <X className="w-3 h-3" />
            </motion.button>
          )}
          {sort !== "rating" && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSort("rating")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
            >
              Sort: {sort === "reviews" ? "Reviews" : "A–Z"}
              <X className="w-3 h-3" />
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Results Count */}
      {filtered.length > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {filtered.length}{" "}
          {filtered.length === 1 ? "business" : "businesses"}
        </p>
      )}

      {/* Business Cards */}
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
              <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-white/85 dark:hover:bg-gray-800/85 transition-all duration-500 shadow-lg hover:shadow-2xl">
                <div className="flex-1">
                  <Link
                    to={`/businesses/${b.id}`}
                    className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {b.name}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
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

                <div className="flex gap-3 items-end md:items-center justify-end">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={`/businesses/${b.id}`}
                      className="btn-outline px-4 py-2"
                    >
                      View
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={`/businesses/${b.id}/review`}
                      className="btn-primary px-4 py-2"
                    >
                      Review
                    </Link>
                  </motion.div>
                  {currentUser && currentUser.id === b.owner_id && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConfirmBusiness(b)}
                      className="btn-outline px-4 py-2"
                    >
                      Delete
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Search className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{
                  color: isDark ? "white" : "#111827",
                }}
              >
                No businesses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              {(term || cat !== "all" || sort !== "rating") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setTerm("");
                    setCat("all");
                    setSort("rating");
                  }}
                  className="px-6 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                >
                  Clear All Filters
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>

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
