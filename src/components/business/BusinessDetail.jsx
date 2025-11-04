import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useData } from "../../data/DataContext.jsx";

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businesses, reviews, users, currentUser } = useData();

  const business = businesses.find((b) => b.id === id);
  const bizReviews = reviews
    .filter((r) => r.business_id === id)
    .map((r) => ({
      ...r,
      user: users.find((u) => u.id === r.user_id),
    }))
    .sort((a, b) => b.id.localeCompare(a.id));

  if (!business)
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600">
        Business not found.
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto px-6 py-14 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden p-[2px] rounded-3xl bg-gradient-border shadow-lg"
      >
        <div className="rounded-3xl bg-white/70 backdrop-blur-md p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {business.name}
            </h1>
            <p className="text-gray-600 text-sm mb-2">{business.address}</p>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700">
              <span className="flex items-center gap-1">
                📞{" "}
                <span className="font-medium">{business.phone || "N/A"}</span>
              </span>
              {business.website && (
                <span className="flex items-center gap-1">
                  🌐{" "}
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Visit Website
                  </a>
                </span>
              )}
            </div>

            <div className="mt-4 text-gray-900 text-base font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 fill-current text-gray-900" />
              {business.average_rating}
              <span className="text-gray-600 font-normal">
                • {bizReviews.length} reviews
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
            {/* ✅ Only owner sees edit button */}
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

      {business.description && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl bg-white/70 backdrop-blur-md p-8 border border-white/50 shadow-md hover:shadow-xl transition-all duration-500"
        >
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            About this business
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {business.description}
          </p>
        </motion.div>
      )}
    </section>
  );
}
