// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// POST /api/auth/register
export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    const token = createToken(user._id.toString());

    return res.status(201).json({
      token,
      user: {
        id: user._id.toString(), // matches frontend expectation
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/auth/login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    // NOTE: "email" field may contain email OR username (from LoginForm)
    // :contentReference[oaicite:1]{index=1}

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email/Username and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
