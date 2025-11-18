import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../data/DataContext.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function BusinessForm({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, rawBusinesses, currentUser, refreshBusinesses } =
    useData();

  // try both id and _id just in case
  const existing =
    rawBusinesses?.find((b) => b.id === id || b._id === id) || null;

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    category_id: categories[0]?.id || "",
    google_map_url: "",
    photos: [],
  });

  const [error, setError] = useState("");

  // fill form when editing
  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        name: existing.name || "",
        description: existing.description || "",
        address: existing.address || "",
        phone: existing.phone || "",
        website: existing.website || "",
        category_id: existing.category_id || categories[0]?.id || "",
        google_map_url: existing.google_map_url || "",
        photos: existing.photos || [],
      });
    }
  }, [isEdit, existing, categories]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ---------- photos (drag & drop / file input) ----------
  const handleFiles = (files) => {
    const list = Array.from(files);
    list.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result;
        if (!url) return;
        setForm((prev) => ({
          ...prev,
          photos: [...(prev.photos || []), url],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // ---------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.address) {
      setError("Name and address are required.");
      return;
    }

    if (!currentUser) {
      setError("You must be logged in to make changes.");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      if (isEdit && existing) {
        const businessId = existing.id || existing._id || id;

        const res = await fetch(
          `${API_BASE_URL}/api/businesses/${businessId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update business");
        }

        // 🔄 make sure all lists/detail views see fresh data
        await refreshBusinesses();
        navigate(`/businesses/${businessId}`);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/businesses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to create business");
        }

        const newId = data._id || data.id;

        // 🔄 refresh global businesses so MyBusinesses / All Businesses / Detail are up-to-date
        await refreshBusinesses();
        navigate(`/businesses/${newId}`);
      }
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  const [isDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-2xl p-[2px] rounded-3xl bg-gradient-border shadow-2xl"
      >
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8">
          <h1
            className="text-3xl font-extrabold mb-6 text-center transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Enter business name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Write a short description..."
              />
            </div>

            {/* Address + Phone */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address *
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Enter business address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Optional phone number"
                />
              </div>
            </div>

            {/* Website + Category */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Google Maps URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Maps URL
              </label>
              <input
                name="google_map_url"
                value={form.google_map_url}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Paste Google Maps share link"
              />
            </div>

            {/* Photos drag & drop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Photos (drag & drop or click to upload)
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
                className="w-full rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-500 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-400 transition-colors"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="photo-upload-input"
                />
                <label htmlFor="photo-upload-input" className="cursor-pointer">
                  Drop images here or{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    browse files
                  </span>
                  .
                </label>
              </div>

              {form.photos && form.photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {form.photos.map((src, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl overflow-hidden border border-white/60 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-900"
                    >
                      <img
                        src={src}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 text-xs px-2 py-1 rounded-full bg-black/60 text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
