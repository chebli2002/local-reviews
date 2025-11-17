// backend/controllers/reviewController.js
import Review from "../models/Review.js";
import Business from "../models/Business.js";

/**
 * POST /api/reviews
 * Create a review (auth required)
 * Expects body: { business_id, rating, comment }
 */
export async function createReview(req, res) {
  try {
    const { business_id, rating, comment } = req.body;

    if (!business_id || rating == null || !comment) {
      return res
        .status(400)
        .json({ message: "business_id, rating, and comment are required" });
    }

    const business = await Business.findById(business_id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      business: business._id,
      user: req.user._id, // from authRequired middleware
      rating: numericRating,
      comment,
    });

    const populated = await review.populate("user", "username email");

    res.status(201).json(populated);
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/reviews/business/:businessId
 * Get all reviews for a given business (public)
 */
export async function getReviewsForBusiness(req, res) {
  try {
    const { businessId } = req.params;

    const reviews = await Review.find({ business: businessId })
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (err) {
    console.error("getReviewsForBusiness error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/reviews/user/:userId
 * Get all reviews written by a specific user (public)
 */
export async function getReviewsForUser(req, res) {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .populate("business", "name address category_id")
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (err) {
    console.error("getReviewsForUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * DELETE /api/reviews/:id
 * Delete a review (only the author can delete)
 */
export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this review" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("deleteReview error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
