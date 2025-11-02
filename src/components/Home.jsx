import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useData } from "../data/DataContext.jsx";

export default function Home() {
  const { businesses, categories } = useData();
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

  const title = "Discover the Best Local Businesses";

  const categoryImages = {
    "Food & Drink":
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    Fitness:
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1200&q=80",
    Services:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  };

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white">
      <div className="pointer-events-none absolute inset-0 aurora-shimmer" />

      <div className="relative z-10 px-6 py-20 space-y-28">
        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1.2,
                  ease: "easeOut",
                  staggerChildren: 0.04,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="leading-tight font-extrabold drop-shadow-xl text-[10vw] sm:text-[8rem] transition-colors duration-500"
            style={{
              whiteSpace: "pre-line",
              color: isDark ? "white" : "#111827",
            }}
          >
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.2 }}
            className="text-xl sm:text-2xl mt-6 mb-12 max-w-3xl transition-colors duration-500"
            style={{
              color: isDark ? "white" : "#1F2937",
            }}
          >
            Read trusted reviews, share your experience, and explore top-rated
            spots near you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.9, ease: "easeOut" }}
          >
            <Link
              to="/businesses"
              className="px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-2xl rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500"
            >
              Explore Businesses
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

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((c, i) => {
              const img = categoryImages[c.name] || categoryImages["Services"];
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

        {/* 🌟 TOP RATED — MATCHED EXACTLY WITH BUSINESSLIST */}
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

          <div className="grid md:grid-cols-2 gap-8">
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
                <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500">
                  <div className="flex-1">
                    <Link
                      to={`/businesses/${b.id}`}
                      className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {b.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {b.address}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center text-gray-900 dark:text-white text-base">
                        <Star
                          className={`w-4 h-4 fill-current ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        />
                        <span className="ml-1">{b.average_rating}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
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
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
