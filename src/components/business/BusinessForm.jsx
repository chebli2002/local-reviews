import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../data/DataContext.jsx";

export default function BusinessForm({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, rawBusinesses, addBusiness, updateBusiness } = useData();

  const existing = rawBusinesses.find((b) => b.id === id);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    category_id: categories[0]?.id || "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && existing) setForm(existing);
  }, [isEdit, existing]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.address) {
      setError("Name and address are required.");
      return;
    }

    if (isEdit && existing) {
      updateBusiness(existing.id, form);
      navigate(`/businesses/${existing.id}`);
    } else {
      const newId = addBusiness(form);
      navigate(`/businesses/${newId}`);
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-2xl p-[2px] rounded-3xl bg-gradient-border shadow-2xl"
      >
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            {isEdit ? "Edit Business" : "Add New Business"}
          </h1>

          {error && (
            <div className="text-red-600 bg-red-100 border border-red-200 px-3 py-2 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Enter business name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Write a short description..."
              />
            </div>

            {/* Address + Phone */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Enter business address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Optional phone number"
                />
              </div>
            </div>

            {/* Website + Category */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              {isEdit ? "Save Changes" : "Create Business"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
