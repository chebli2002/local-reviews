// backend/routes/reviewRoutes.js
import express from "express";
import {
  createReview,
  getReviewsForBusiness,
  getReviewsForUser,
  deleteReview,
} from "../controllers/reviewController.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC
router.get("/business/:businessId", getReviewsForBusiness);
router.get("/user/:userId", getReviewsForUser);

// PROTECTED
router.post("/", authRequired, createReview);
router.delete("/:id", authRequired, deleteReview);

export default router;
