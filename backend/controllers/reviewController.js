import Review from "../models/Review.js";
import Business from "../models/Business.js";

/**
 * POST /api/reviews
 * Create a review (auth required)
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
      user: req.user._id,
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
 * PUT /api/reviews/:id
 * Edit a review (only the author can edit)
 */
export async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this review" });
    }

    if (rating != null) {
      const numericRating = Number(rating);
      if (numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: "Rating must be 1–5" });
      }
      review.rating = numericRating;
    }

    if (comment != null) {
      if (!comment.trim()) {
        return res.status(400).json({ message: "Comment cannot be empty" });
      }
      review.comment = comment.trim();
    }

    await review.save();

    const populated = await review.populate("user", "username email");

    res.json(populated);
  } catch (err) {
    console.error("updateReview error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * DELETE /api/reviews/:id
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
