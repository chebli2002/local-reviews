import { Link, useLocation } from "react-router-dom";
import { useData } from "../../data/DataContext.jsx";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BusinessesList() {
  const { businesses, categories } = useData();
  const qs = useQuery();

  const [term, setTerm] = useState(qs.get("q") || "");
  const [cat, setCat] = useState(qs.get("category") || "all");
  const [sort, setSort] = useState("rating");

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

  return (
    <section className="max-w-7xl mx-auto px-6 py-14 space-y-12 text-gray-900">
      <h1 className="text-4xl font-extrabold text-center tracking-tight mb-6">
        All Businesses
      </h1>

      {/* 🌸 Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative p-[2px] rounded-3xl bg-gradient-border shadow-lg"
      >
        <div className="grid sm:grid-cols-4 gap-3 bg-white/60 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/40">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="🔍  Search by name or address..."
            className="col-span-2 rounded-xl px-4 py-3 bg-white/70 backdrop-blur-md border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
          />

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-xl px-3 py-3 bg-white/70 backdrop-blur-md border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 text-gray-800 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
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
            className="rounded-xl px-3 py-3 bg-white/70 backdrop-blur-md border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 text-gray-800 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <option value="rating">Sort: Rating</option>
            <option value="reviews">Sort: Reviews</option>
            <option value="name">Sort: A–Z</option>
          </select>
        </div>
      </motion.div>

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
                boxShadow: "0 0 40px rgba(147, 197, 253, 0.25)",
              }}
              className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-border"
            >
              <div className="rounded-3xl bg-white/70 backdrop-blur-md p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-white/80 transition-all duration-500">
                <div className="flex-1">
                  <Link
                    to={`/businesses/${b.id}`}
                    className="text-2xl font-semibold hover:text-indigo-600 transition-colors"
                  >
                    {b.name}
                  </Link>
                  <p className="text-sm text-gray-600">{b.address}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-yellow-500 text-base">
                      ⭐ <span className="ml-1">{b.average_rating}</span>
                    </div>
                    <span className="text-gray-600 text-sm">
                      • {b.review_count} reviews
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-end md:items-center justify-end">
                  <Link
                    to={`/businesses/${b.id}`}
                    className="btn-outline px-4 py-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/businesses/${b.id}/review`}
                    className="btn-primary px-4 py-2"
                  >
                    Review
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-gray-600 text-center py-10 text-lg">
            No businesses found.
          </div>
        )}
      </div>
    </section>
  );
}
