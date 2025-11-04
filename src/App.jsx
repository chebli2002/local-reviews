import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useData } from "./data/DataContext.jsx";
import Navbar from "./components/globals/Navbar.jsx";
import DarkModeToggle from "./components/globals/DarkModeToggle.jsx";
import BackToTop from "./components/globals/BackToTop.jsx";
import Home from "./components/Home.jsx";
import BusinessesList from "./components/business/BusinessesList.jsx";
import BusinessDetail from "./components/business/BusinessDetail.jsx";
import BusinessForm from "./components/business/BusinessForm.jsx";
import WriteReviewForm from "./components/Reviews/WriteReviewForm.jsx";
import UserReviews from "./components/Reviews/UserReviews.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import RegisterForm from "./components/auth/RegisterForm.jsx";
import NotFound from "./components/NotFound.jsx";
import Footer from "./components/globals/Footer.jsx";

function ProtectedRoute({ children }) {
  const { currentUser } = useData();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-gradient-aurora bg-aurora-overlay overflow-hidden relative">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.99 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="p-4"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/businesses" element={<BusinessesList />} />
            <Route
              path="/businesses/new"
              element={
                <ProtectedRoute>
                  <BusinessForm />
                </ProtectedRoute>
              }
            />
            <Route path="/businesses/:id" element={<BusinessDetail />} />
            <Route
              path="/businesses/:id/edit"
              element={
                <ProtectedRoute>
                  <BusinessForm isEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/businesses/:id/review"
              element={
                <ProtectedRoute>
                  <WriteReviewForm />
                </ProtectedRoute>
              }
            />
            <Route path="/users/:id/reviews" element={<UserReviews />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <DarkModeToggle />
      <BackToTop />
    </div>
  );
}
