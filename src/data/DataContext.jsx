import { createContext, useContext, useMemo, useState } from "react";
import { nanoid } from "nanoid";

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

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
    highlights: ["Same-day turnaround", "Certified technicians", "1-year warranty"],
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

const reviewsSeed = [
  {
    id: "r1",
    user_id: "u1",
    business_id: "b1",
    rating: 5,
    comment: "Amazing coffee and friendly staff!",
  },
  {
    id: "r2",
    user_id: "u2",
    business_id: "b1",
    rating: 4,
    comment: "Nice croissants and chill vibe.",
  },
  {
    id: "r3",
    user_id: "u2",
    business_id: "b2",
    rating: 3,
    comment: "Good gym but too crowded.",
  },
];

function averageRating(businessId, reviews) {
  const r = reviews.filter((rev) => rev.business_id === businessId);
  if (!r.length) return 0;
  return (
    Math.round((r.reduce((sum, rev) => sum + rev.rating, 0) / r.length) * 10) /
    10
  );
}

export function DataProvider({ children }) {
  const [categories] = useState(categoriesSeed);
  const [businesses, setBusinesses] = useState(businessesSeed);
  const [users, setUsers] = useState(usersSeed);
  const [reviews, setReviews] = useState(reviewsSeed);
  const [currentUser, setCurrentUser] = useState(null);

  const businessesWithRatings = useMemo(() => {
    return businesses.map((b) => ({
      ...b,
      average_rating: averageRating(b.id, reviews),
      review_count: reviews.filter((r) => r.business_id === b.id).length,
    }));
  }, [businesses, reviews]);

  // ✅ Add business (assign owner)
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

  // ✅ Update business (only owner can edit)
  const updateBusiness = (id, payload) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id && b.owner_id === currentUser?.id ? { ...b, ...payload } : b
      )
    );
  };

  const addReview = ({ business_id, rating, comment }) => {
    if (!currentUser) throw new Error("You must log in first.");
    const review = {
      id: nanoid(8),
      user_id: currentUser.id,
      business_id,
      rating: Number(rating),
      comment,
    };
    setReviews((prev) => [review, ...prev]);
  };

  const login = ({ email, password }) => {
    const user = users.find(
      (u) =>
        (u.email === email || u.username === email) && u.password === password
    );
    if (!user) throw new Error("Invalid credentials");
    setCurrentUser(user);
    return user;
  };

  const logout = () => setCurrentUser(null);

  const register = ({ username, email, password }) => {
    if (users.some((u) => u.email === email))
      throw new Error("Email already in use");
    const newUser = { id: nanoid(6), username, email, password };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
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
    updateBusiness,
    addReview,
    login,
    logout,
    register,
    getUserReviews,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
