import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin, Phone, Clock3 } from "lucide-react";
import { useData } from "../../data/DataContext.jsx";
import RatingStars from "./RatingStars.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businesses, currentUser } = useData();

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

  // Reviews loaded from backend
  const [bizReviews, setBizReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/business/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load reviews");
        }

        setBizReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err.message);
        setBizReviews([]);
      }
    }

    fetchReviews();
  }, [id]);

  // Find this business from context (which comes from backend)
  const business = businesses.find((b) => b.id === id);

  // Safely compute average rating
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

  return (
    <section className="max-w-4xl mx-auto px-6 py-14 space-y-10">
      {/* Top card with name / rating / buttons */}
  const gallery = business.gallery || [];
  const highlights = business.highlights || [];
  const hours = business.hours || {};
  const heroImage =
    business.heroImage ||
    "https://images.unsplash.com/photo-1529429617124-aee711a70412?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="max-w-5xl mx-auto px-6 py-14 space-y-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800/60"
      >
        <div className="relative h-64 sm:h-80 md:h-96">
          <img
            src={heroImage}
            alt={`${business.name} hero`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white drop-shadow-xl space-y-2">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">
              Featured business
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              {business.name}
            </h1>
            <RatingStars
              rating={business.average_rating}
              className="text-white"
              showValue
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden p-[2px] rounded-3xl bg-gradient-border shadow-lg"
      >
        <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{business.address}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="font-medium">{business.phone || "N/A"}</span>
              </span>
              {business.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    Visit Site
                  </a>
                </span>
              )}
            </div>

            <div
              className="mt-4 text-base font-semibold flex items-center gap-2 transition-colors duration-300"
              style={{ color: isDark ? "white" : "#111827" }}
            >
              <Star
                className={`w-5 h-5 fill-current ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              />
              {avgRating}
              <span className="text-gray-600 dark:text-gray-300 font-normal">
                • {bizReviews.length} reviews
            <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-300">
              <RatingStars rating={business.average_rating} />
              <span className="text-sm font-medium">
                {bizReviews.length}{" "}
                {bizReviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/businesses/${business.id}/review`}
              className="btn-primary text-center text-base"
            >
              Write a Review
            </Link>
            {currentUser && currentUser.id === business.owner_id && (
              <button
                onClick={() => navigate(`/businesses/${business.id}/edit`)}
                className="btn-outline text-base"
              >
                Edit Business
              </button>
            )}
          </div>

          <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-indigo-400/10 via-purple-400/20 to-pink-300/10 pointer-events-none"></div>
        </div>
      </motion.div>

      {/* About */}
      {highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 border border-white/50 dark:border-gray-700/50 shadow-md"
        >
          <h2
            className="text-2xl font-bold mb-4 transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            Highlights
          </h2>
          <div className="flex flex-wrap gap-3">
            {highlights.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      )}

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

      {/* Location / Google Maps */}
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
              ></iframe>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((src, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden border border-white/60 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-900"
              >
                <img
                  src={src}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover"
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 border border-white/50 dark:border-gray-700/50 shadow-md"
        >
          <h2
            className="text-2xl font-bold mb-4 transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            Contact & Hours
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <span>{business.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-indigo-500" />
              <span>{business.phone || "N/A"}</span>
            </li>
            {business.website && (
              <li className="flex gap-3">
                <Globe className="w-5 h-5 text-indigo-500" />
                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {business.website.replace(/^https?:\/\//, "")}
                </a>
              </li>
            )}
            {(hours.weekdays || hours.weekend) && (
              <li className="flex gap-3">
                <Clock3 className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  {hours.weekdays && (
                    <p>
                      <span className="font-semibold">Weekdays:</span>{" "}
                      {hours.weekdays}
                    </p>
                  )}
                  {hours.weekend && (
                    <p>
                      <span className="font-semibold">Weekend:</span>{" "}
                      {hours.weekend}
                    </p>
                  )}
                </div>
              </li>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-3xl overflow-hidden bg-white/70 dark:bg-gray-800/70 border border-white/50 dark:border-gray-700/50 shadow-md"
        >
          {business.mapEmbed ? (
            <iframe
              src={business.mapEmbed}
              title={`${business.name} map`}
              loading="lazy"
              className="w-full h-[320px]"
              allowFullScreen
            />
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Map coming soon
            </div>
          )}
        </motion.div>
      </div>

      {gallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 border border-white/50 dark:border-gray-700/50 shadow-md"
        >
          <h2
            className="text-2xl font-bold mb-4 transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            Photo Gallery
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {gallery.map((img) => (
              <div
                key={img}
                className="rounded-2xl overflow-hidden border border-white/40 dark:border-gray-700/40"
              >
                <img
                  src={img}
                  alt={`${business.name} preview`}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Customer Reviews */}
      {/* ✅ Reviews Section - Visible to everyone */}
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

        {bizReviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {bizReviews.map((r) => (
              <li
                key={r._id || r.id}
                className="p-4 rounded-xl bg-white/60 dark:bg-gray-900/50 border border-white/30 dark:border-gray-700/40 backdrop-blur-md transition-all duration-300 hover:shadow-md"
              >
                <p className="text-gray-900 dark:text-gray-100 text-base mb-2">
                  {r.comment}
                </p>
                <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>— {r.user?.username || "Anonymous"}</span>
                  <RatingStars
                    rating={r.rating}
                    showValue={false}
                    size={14}
                    className="text-amber-400"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </section>
  );
}
