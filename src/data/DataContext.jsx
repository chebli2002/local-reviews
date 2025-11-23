// src/data/DataContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ----------------------------------------------
// STATIC CATEGORIES (must remain since backend has no categories)
// ----------------------------------------------
const categoriesSeed = [
  { id: "cat-restaurant", name: "Restaurant" },
  { id: "cat-cafe", name: "Cafe" },
  { id: "cat-retail", name: "Retail" },
  { id: "cat-fitness", name: "Fitness" },
  { id: "cat-services", name: "Services" },
  { id: "cat-beauty", name: "Beauty & Spa" },
  { id: "cat-healthcare", name: "Healthcare" },
  { id: "cat-education", name: "Education" },
  { id: "cat-entertainment", name: "Entertainment" },
  { id: "cat-automotive", name: "Automotive" },
  // Legacy categories for backward compatibility
  { id: "cat-food", name: "Food & Drink" },
];

// ----------------------------------------------
// NORMALIZATION HELPERS
// ----------------------------------------------
function normalizeUser(user) {
  if (!user) return null;
  const id = user.id || user._id;
  return {
    ...user,
    id,
    _id: user._id || id,
  };
}

function normalizeBusiness(b) {
  if (!b) return b;

  const id = b.id || b._id;
  let owner_id = b.owner_id;

  // Ensure owner_id is always a string rather than an object
  if (owner_id && typeof owner_id === "object") {
    owner_id = owner_id._id || owner_id.id;
  }

  return {
    ...b,
    id,
    _id: id,
    owner_id,
  };
}

// ----------------------------------------------
// PROVIDER
// ----------------------------------------------
export function DataProvider({ children }) {
  const [categories] = useState(categoriesSeed);
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]); // global caching of user's reviews
  const [currentUser, setCurrentUser] = useState(null);

  // NEW: flag so the app knows when we've finished checking localStorage
  const [authReady, setAuthReady] = useState(false);

  // ----------------------------------------------
  // LOAD USER FROM LOCAL STORAGE
  // ----------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const normalized = normalizeUser(JSON.parse(storedUser));
        setCurrentUser(normalized);
      } catch {
        // ignore parse errors, treat as logged out
      }
    }
    // we're done checking localStorage either way
    setAuthReady(true);
  }, []);

  // ----------------------------------------------
  // LOAD BUSINESSES FROM BACKEND
  // ----------------------------------------------
  const refreshBusinesses = async (page = 1, limit = 10) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/businesses?page=${page}&limit=${limit}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load businesses");

      const normalized = (data.businesses || data).map((b) =>
        normalizeBusiness(b)
      );
      setBusinesses(normalized);
      return data.pagination || null;
    } catch (err) {
      console.error("Failed to load businesses:", err.message);
      return null;
    }
  };

  useEffect(() => {
    // Load more businesses initially for better UX
    refreshBusinesses(1, 50);
  }, []);

  // ----------------------------------------------
  // LOGIN FUNCTION
  // ----------------------------------------------
  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    const { token, user } = data;
    const normalizedUser = normalizeUser(user);

    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
    setCurrentUser(normalizedUser);

    return normalizedUser;
  };

  // ----------------------------------------------
  // REGISTER
  // ----------------------------------------------
  const register = async ({ username, email, password }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    const { token, user } = data;
    const normalizedUser = normalizeUser(user);

    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
    setCurrentUser(normalizedUser);

    return normalizedUser;
  };

  // ----------------------------------------------
  // LOGOUT
  // ----------------------------------------------
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };

  // ----------------------------------------------
  // DELETE BUSINESS
  // ----------------------------------------------
  const deleteBusiness = async (businessId) => {
    if (!currentUser) throw new Error("You must log in first.");

    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("You are not authenticated.");

    const res = await fetch(`${API_BASE_URL}/api/businesses/${businessId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Failed to delete business");

    setBusinesses((prev) =>
      prev.filter((b) => b.id !== businessId && b._id !== businessId)
    );

    return true;
  };

  // ----------------------------------------------
  // ADD REVIEW
  // ----------------------------------------------
  const addReview = async ({ business_id, rating, comment }) => {
    if (!currentUser) throw new Error("You must log in first.");

    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("You are not authenticated.");

    const body = {
      business_id, // your backend expects business_id
      rating: Number(rating),
      comment,
    };

    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to submit review");

    // Push into local state
    setReviews((prev) => [data, ...prev]);

    return data;
  };

  // ----------------------------------------------
  // DELETE REVIEW
  // ----------------------------------------------
  const deleteReview = async (reviewId) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Failed to delete review");

    setReviews((prev) => prev.filter((r) => r._id !== reviewId));

    return true;
  };

  // ----------------------------------------------
  // EDIT REVIEW
  // ----------------------------------------------
  const updateReview = async (reviewId, payload) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const updated = await res.json();
    if (!res.ok) throw new Error(updated.message || "Failed to update review");

    setReviews((prev) => prev.map((r) => (r._id === reviewId ? updated : r)));

    return updated;
  };

  // ----------------------------------------------
  // GET USER REVIEWS
  // ----------------------------------------------
  const getUserReviews = async (userId) => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/user/${userId}`);
    return await res.json();
  };

  // ----------------------------------------------
  // COMPUTED BUSINESSES WITH RATINGS
  // ----------------------------------------------
  const businessesWithRatings = useMemo(
    () =>
      businesses.map((b) => ({
        ...b,
        average_rating:
          typeof b.average_rating === "number"
            ? Math.round(b.average_rating * 10) / 10
            : 0,
        review_count: typeof b.review_count === "number" ? b.review_count : 0,
      })),
    [businesses]
  );

  // ----------------------------------------------
  // PROVIDER VALUE
  // ----------------------------------------------
  const value = {
    categories,
    businesses: businessesWithRatings,
    rawBusinesses: businesses,
    currentUser,
    authReady, // <- NEW
    addReview,
    deleteReview,
    updateReview,
    login,
    logout,
    register,
    deleteBusiness,
    refreshBusinesses,
    getUserReviews,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
