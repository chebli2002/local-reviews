import { Link } from "react-router-dom";
import { useData } from "../../data/DataContext.jsx";
import { motion } from "framer-motion";

export default function MyBusinesses() {
  const { businesses, currentUser } = useData();

  if (!currentUser) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">You must log in</h2>
        <p className="mb-6">Please log in to view your businesses.</p>
        <Link className="btn-primary px-6 py-3" to="/login">
          Log In
        </Link>
      </section>
    );
  }

  const myBusinesses = businesses.filter((b) => b.owner_id === currentUser.id);

  return (
    <section className="max-w-7xl mx-auto px-6 py-14 space-y-12 text-gray-900 dark:text-white">
      <h1 className="text-4xl font-extrabold text-center tracking-tight mb-6">
        Your Businesses
      </h1>

      {myBusinesses.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold mb-3">
            You have no businesses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click below to create your first business.
          </p>
          <Link to="/businesses/new" className="btn-primary px-6 py-3">
            Add New Business
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center">
            <Link to="/businesses/new" className="btn-primary px-6 py-3">
              Add New Business
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {myBusinesses.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-border"
              >
                <div className="rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 flex flex-col justify-between gap-4 shadow-lg">
                  <div>
                    <Link
                      to={`/businesses/${b.id}`}
                      className="text-2xl font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {b.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {b.address}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Link
                      to={`/businesses/${b.id}`}
                      className="btn-outline px-4 py-2"
                    >
                      View
                    </Link>

                    <Link
                      to={`/businesses/${b.id}/edit`}
                      className="btn-primary px-4 py-2"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
