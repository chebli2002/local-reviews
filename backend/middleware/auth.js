// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId: "...", iat, exp }

    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach user to request for later use
    req.user = user;
    next();
  } catch (err) {
    console.error("authRequired error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
