import express from "express";
import {
  createReview,
  getReviewsForBusiness,
  getReviewsForUser,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC
router.get("/business/:businessId", getReviewsForBusiness);
router.get("/user/:userId", getReviewsForUser);

// PROTECTED
router.post("/", authRequired, createReview);
router.put("/:id", authRequired, updateReview); // ⭐ NEW
router.delete("/:id", authRequired, deleteReview);

export default router;
