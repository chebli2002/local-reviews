import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../data/DataContext.jsx";

export default function RegisterForm() {
  const { register } = useData();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

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

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const passwordChecks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password)
      return setError("All fields are required.");
    if (
      !passwordChecks.length ||
      !passwordChecks.uppercase ||
      !passwordChecks.number ||
      !passwordChecks.special
    ) {
      return setError(
        "Password must be at least 8 characters, with an uppercase letter, a number, and a special character."
      );
    }

    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    try {
      const user = await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate(`/users/${user.id}/reviews`);
    } catch (err) {
      setError(err.message || "Registration failed");
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
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8">
          <h1
            className="text-3xl font-extrabold mb-6 text-center transition-colors duration-300"
            style={{ color: isDark ? "white" : "#111827" }}
          >
            Create Account
          </h1>

          {error && (
            <div className="text-red-600 bg-red-100 border border-red-200 px-3 py-2 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "username", label: "Username", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "password", label: "Password", type: "password" },
              {
                name: "confirm",
                label: "Confirm Password",
                type: "password",
              },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-400 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />

                {name === "password" && (
                  <div className="mt-2 text-xs space-y-1">
                    <p
                      className={
                        passwordChecks.length
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {passwordChecks.length ? "✔" : "✘"} Minimum 8 characters
                    </p>
                    <p
                      className={
                        passwordChecks.uppercase
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {passwordChecks.uppercase ? "✔" : "✘"} At least one
                      uppercase letter
                    </p>
                    <p
                      className={
                        passwordChecks.number
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {passwordChecks.number ? "✔" : "✘"} At least one number
                    </p>
                    <p
                      className={
                        passwordChecks.special
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {passwordChecks.special ? "✔" : "✘"} At least one special
                      character
                    </p>
                  </div>
                )}
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              Register
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
