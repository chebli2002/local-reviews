// src/data/DataContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { nanoid } from "nanoid";

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const categoriesSeed = [
  { id: "cat-food", name: "Food & Drink" },
  { id: "cat-fitness", name: "Fitness" },
  { id: "cat-services", name: "Services" },
];

const businessesSeed = [
  {
    id: "b1",
    name: "Sunrise Café",
    description: "Cozy neighborhood café with specialty coffee and pastries.",
    address: "123 Market St",
    phone: "555-1234",
    website: "https://sunrisecafe.local",
    category_id: "cat-food",
    owner_id: "u1",
    heroImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: ["Pour-over coffee", "Local pastries", "Sunny workspace"],
    hours: {
      weekdays: "6:30 AM – 6:00 PM",
      weekend: "7:00 AM – 4:00 PM",
    },
    mapEmbed:
      "https://maps.google.com/maps?q=Market%20Street%20San%20Francisco&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "b2",
    name: "IronFit Gym",
    description: "24/7 gym with classes and personal training.",
    address: "45 Fitness Ave",
    phone: "555-8877",
    website: "https://ironfit.local",
    category_id: "cat-fitness",
    owner_id: "u2",
    heroImage:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: ["24/7 access", "Group classes", "Certified trainers"],
    hours: {
      weekdays: "Open 24 hours",
      weekend: "Open 24 hours",
    },
    mapEmbed:
      "https://maps.google.com/maps?q=Fitness%20Ave%20Los%20Angeles&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "b3",
    name: "SwiftFix Repairs",
    description: "Fast phone & laptop repairs with warranty.",
    address: "9 Tech Park",
    phone: "555-4411",
    website: "https://swiftfix.local",
    category_id: "cat-services",
    owner_id: "u1",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: [
      "Same-day turnaround",
      "Certified technicians",
      "1-year warranty",
    ],
    hours: {
      weekdays: "9:00 AM – 7:00 PM",
      weekend: "10:00 AM – 4:00 PM",
    },
    mapEmbed:
      "https://maps.google.com/maps?q=Tech%20Park%20Austin&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
];

const usersSeed = [
  {
    id: "u1",
    username: "alice",
    email: "alice@example.com",
    password: "alice123",
  },
  { id: "u2", username: "bob", email: "bob@example.com", password: "bob123" },
];

// normalize helpers
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
  let owner_id = b.owner_id ?? b.owner;
  if (owner_id && typeof owner_id === "object") {
    owner_id = owner_id._id || owner_id.id;
  }

  return {
    ...b,
    id,
    _id: b._id || id,
    owner_id,
  };
}

export function DataProvider({ children }) {
  const [categories] = useState(categoriesSeed);
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState(usersSeed);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // 🔐 Load user from localStorage on mount, AND make sure users[] contains them
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const normalized = normalizeUser(parsed);
        setCurrentUser(normalized);

        // 🔑 make sure My Reviews can find this user by id
        setUsers((prev) => {
          const exists = prev.some((u) => u.id === normalized.id);
          if (exists) return prev;
          return [...prev, normalized];
        });
      } catch {
        // ignore corrupted storage
      }
    }
  }, []);

  // 🔄 Load businesses from backend
  const refreshBusinesses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/businesses`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load businesses");
      }

      const normalized = data.map((b) => normalizeBusiness(b));
      setBusinesses(normalized);
    } catch (err) {
      console.error("Failed to load businesses:", err.message);
    }
  };

  useEffect(() => {
    refreshBusinesses();
  }, []);

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

  // local-only helpers kept to avoid breaking components
  const addBusiness = (payload) => {
    if (!currentUser) throw new Error("You must log in first.");
    const id = nanoid(6);
    setBusinesses((prev) => [
      ...prev,
      {
        ...{
          gallery: [],
          highlights: [],
          hours: {},
          heroImage: "",
          mapEmbed: "",
        },
        ...payload,
        id,
        owner_id: currentUser.id,
      },
    ]);
    return id;
  };

  const updateBusinessLocal = (id, payload) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id && b.owner_id === currentUser?.id ? { ...b, ...payload } : b
      )
    );
  };

  const deleteBusiness = async (businessId) => {
    if (!currentUser) {
      throw new Error("You must log in first.");
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("You are not authenticated.");
    }

    const res = await fetch(`${API_BASE_URL}/api/businesses/${businessId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore
    }

    if (!res.ok) {
      throw new Error(data?.message || "Failed to delete business");
    }

    setBusinesses((prev) =>
      prev.filter((b) => b.id !== businessId && b._id !== businessId)
    );

    return true;
  };

  // backend review creation + local mirror
  const addReview = async ({ business_id, rating, comment }) => {
    if (!currentUser) throw new Error("You must log in first.");

    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("You are not authenticated.");
    }

    const body = {
      businessId: business_id,
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

    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore
    }

    if (!res.ok) {
      throw new Error(data?.message || "Failed to submit review");
    }

    const normalizedReview = {
      id: data._id || data.id || nanoid(8),
      user_id: currentUser.id,
      business_id,
      rating: data.rating ?? Number(rating),
      comment: data.comment ?? comment,
    };

    setReviews((prev) => [normalizedReview, ...prev]);

    return normalizedReview;
  };

  // auth
  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      const message = data?.message || "Login failed";
      throw new Error(message);
    }

    const { token, user } = data;
    const normalizedUser = normalizeUser(user);

    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
    setCurrentUser(normalizedUser);

    setUsers((prev) => {
      const exists = prev.some((u) => u.id === normalizedUser.id);
      if (exists) return prev;
      return [...prev, normalizedUser];
    });

    return normalizedUser;
  };

  const register = async ({ username, email, password }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      const message = data?.message || "Registration failed";
      throw new Error(message);
    }

    const { token, user } = data;
    const normalizedUser = normalizeUser(user);

    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
    setCurrentUser(normalizedUser);

    setUsers((prev) => [...prev, normalizedUser]);

    return normalizedUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };

  const getUserReviews = (userId) =>
    reviews.filter((r) => r.user_id === userId);

  const value = {
    categories,
    businesses: businessesWithRatings,
    rawBusinesses: businesses,
    users,
    reviews,
    currentUser,
    addBusiness,
    updateBusiness: updateBusinessLocal,
    deleteBusiness,
    addReview,
    login,
    logout,
    register,
    getUserReviews,
    refreshBusinesses,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
