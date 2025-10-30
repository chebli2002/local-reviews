import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../data/DataContext.jsx";

export default function LoginForm() {
  const { login } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password)
      return setError("Email/Username and password are required.");
    try {
      const user = login({ email, password });
      navigate(`/users/${user.id}/reviews`);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md p-[2px] rounded-3xl bg-gradient-border shadow-2xl"
      >
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Welcome Back
          </h1>

          {error && (
            <div className="text-red-600 bg-red-100 border border-red-200 px-3 py-2 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email or Username
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              Log In
            </motion.button>
          </form>

          <p className="text-sm text-gray-700 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
