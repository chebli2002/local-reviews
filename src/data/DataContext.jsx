import { createContext, useContext, useMemo, useState } from "react";
import { nanoid } from "nanoid";

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

// Initial data (mock)
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
  },
  {
    id: "b2",
    name: "IronFit Gym",
    description: "24/7 gym with classes and personal training.",
    address: "45 Fitness Ave",
    phone: "555-8877",
    website: "https://ironfit.local",
    category_id: "cat-fitness",
  },
  {
    id: "b3",
    name: "SwiftFix Repairs",
    description: "Fast phone & laptop repairs with warranty.",
    address: "9 Tech Park",
    phone: "555-4411",
    website: "https://swiftfix.local",
    category_id: "cat-services",
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

  const addBusiness = (payload) => {
    const id = nanoid(6);
    setBusinesses((prev) => [...prev, { id, ...payload }]);
    return id;
  };

  const updateBusiness = (id, payload) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...payload } : b))
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
