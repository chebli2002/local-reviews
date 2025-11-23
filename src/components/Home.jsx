import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../data/DataContext.jsx";
import RatingStars from "./business/RatingStars.jsx";

export default function Home() {
  const { businesses, categories, currentUser } = useData();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
  }, []);

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

  const top = [...businesses]
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, 3);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const categoryImages = {
    Restaurant:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    Cafe:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    Retail:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    Fitness:
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1200&q=80",
    Services:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    "Beauty & Spa":
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    Healthcare:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    Education:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    Entertainment:
      "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80",
    Automotive:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  };

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white">
      <div className="pointer-events-none absolute inset-0 aurora-shimmer" />

      <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 space-y-16 sm:space-y-28">
        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center gap-8">
          <motion.p
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-xs sm:text-sm uppercase tracking-[0.6em] dark:text-indigo-300"
  style={{
    color: isDark ? "#93c5fd" : "#000000", // black in light mode, indigo-300 in dark mode
  }}
>
  Local Reviews
</motion.p>


          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight transition-colors duration-500"
            style={{
              color: isDark ? "white" : "#0f172a",
            }}
          >
            Discover standout local{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              businesses
            </span>{" "}
            and share your story.
          </motion.h1>

          {/* ⭐ SUBTITLE WE'RE FIXING */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-base sm:text-xl max-w-3xl mx-auto transition-colors duration-500"
            style={{
              color: isDark ? "#ffffff" : "#111827", // dark: white, light: almost black
            }}
          >
            Read trusted reviews from neighbors, support independent shops, and
            help others discover their next favorite spot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/businesses"
              className="px-8 py-4 text-lg rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              Browse businesses
            </Link>
            <Link
              to={currentUser ? "/businesses/new" : "/login"}
             className="px-8 py-4 text-lg rounded-full border border-white/60 dark:border-purple-500 text-gray-900 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-300"
            >
              List your business
            </Link>
          </motion.div>
        </section>

        {/* POPULAR CATEGORIES */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="fade-in max-w-7xl mx-auto"
        >
          <h2
            className="text-3xl font-bold mb-12 text-center transition-colors duration-500"
            style={{
              color: isDark ? "white" : "#111827",
            }}
          >
            Popular Categories
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {categories
              .filter((c) => c.name !== "Food & Drink")
              .map((c, i) => {
                const img = categoryImages[c.name] || categoryImages["Retail"];
                return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.06 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/businesses?category=${encodeURIComponent(c.id)}`}
                    className="relative group block overflow-hidden rounded-3xl shadow-lg h-64 sm:h-72 md:h-80"
                  >
                    <motion.img
                      src={img}
                      alt={c.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:translate-y-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-500"></div>

                    <div className="absolute bottom-6 left-6 text-white drop-shadow-md">
                      <h3 className="text-2xl font-semibold text-white">
                        {c.name}
                      </h3>
                      <p className="text-sm text-gray-200">
                        Explore {c.name} in your area
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* TOP RATED */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="fade-in max-w-7xl mx-auto"
        >
          <h2
            className="text-3xl font-bold mb-8 text-center transition-colors duration-500"
            style={{
              color: isDark ? "white" : "#111827",
            }}
          >
            Top Rated
          </h2>

          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {top.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 40px rgba(147, 197, 253, 0.25)",
                }}
                className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-border"
              >
                <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 md:p-6 flex flex-col md:flex-row items-start gap-4 md:gap-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500 shadow-lg hover:shadow-2xl">
                  {/* Business Image - Show on mobile too */}
                  {b.photos && b.photos.length > 0 ? (
                    <div className="w-full md:w-32 h-48 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-white/60 dark:border-gray-700/60 md:order-3">
                      <img
                        src={b.photos[0]}
                        alt={b.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="flex-1 min-w-0 flex flex-col justify-start w-full md:w-auto">
                    <Link
                      to={`/businesses/${b.id}`}
                      className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-words"
                    >
                      {b.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                      {b.address}
                    </p>

                    <div className="mt-3 flex items-center gap-2 md:gap-3 flex-wrap">
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

                  <div className="flex gap-2 md:gap-3 items-center md:items-start flex-shrink-0 w-full md:w-auto justify-end md:justify-start md:order-2">
                    <Link
                      to={`/businesses/${b.id}`}
                      className="btn-outline px-3 md:px-4 py-2 text-sm md:text-base"
                    >
                      View
                    </Link>
                    <Link
                      to={`/businesses/${b.id}/review`}
                      className="btn-primary px-3 md:px-4 py-2 text-sm md:text-base"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
