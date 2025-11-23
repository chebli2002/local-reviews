import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const app = express(); // ✅ You must create app BEFORE using app.use()

const allowedOrigins = [
  "https://local-reviews.vercel.app", // Vercel frontend
  "http://localhost:5173", // local dev Vite (common)
  "http://localhost:5174", // your current port
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools (no origin) AND allowed frontend URLs
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
