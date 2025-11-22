// backend/controllers/businessController.js
import Business from "../models/Business.js";
import Review from "../models/Review.js";

/**
 * GET /api/businesses
 * Public - returns list of all businesses with review_count + average_rating
 * Supports pagination: ?page=1&limit=10
 */
export async function getAllBusinesses(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
      });
    }

    const total = await Business.countDocuments();
    const businesses = await Business.find().skip(skip).limit(limit).lean();

    const businessesWithStats = await Promise.all(
      businesses.map(async (b) => {
        const reviews = await Review.find({ business: b._id });
        const reviewCount = reviews.length;
        const avgRating =
          reviewCount === 0
            ? 0
            : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

        return {
          ...b,
          average_rating: avgRating,
          review_count: reviewCount,
        };
      })
    );

    res.json({
      businesses: businessesWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("getAllBusinesses error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/businesses/:id
 * Returns a business + its reviews (with username populated)
 */
export async function getBusinessById(req, res) {
  try {
    const business = await Business.findById(req.params.id).lean();

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const reviews = await Review.find({ business: business._id })
      .populate("user", "username email")
      .lean();

    const reviewCount = reviews.length;
    const avgRating =
      reviewCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    res.json({
      ...business,
      reviews,
      average_rating: avgRating,
      review_count: reviewCount,
    });
  } catch (err) {
    console.error("getBusinessById error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/businesses
 * Create business (auth required)
 */
export async function createBusiness(req, res) {
  try {
    const {
      name,
      description,
      address,
      phone,
      website,
      category_id,
      google_map_url,
      photos,
    } = req.body;

    if (!name || !address || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const business = await Business.create({
      name,
      description,
      address,
      phone,
      website,
      category_id,
      owner_id: req.user._id, // from auth middleware
      google_map_url,
      photos,
    });

    res.status(201).json(business);
  } catch (err) {
    console.error("createBusiness error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * PUT /api/businesses/:id
 * Edit business (owner only)
 */
export async function updateBusiness(req, res) {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Support both new owner_id and legacy owner field.
    // If no owner is set at all, first editor becomes the owner.
    let ownerId = business.owner_id || business.owner;

    if (!ownerId) {
      // claim ownership if business has no owner
      business.owner_id = req.user._id;
      ownerId = req.user._id;
    }

    if (ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this business" });
    }

    const updateFields = [
      "name",
      "description",
      "address",
      "phone",
      "website",
      "category_id",
      "google_map_url",
      "photos",
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        business[field] = req.body[field];
      }
    });

    const updated = await business.save();

    res.json(updated);
  } catch (err) {
    console.error("updateBusiness error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * DELETE /api/businesses/:id
 * Delete business (owner only)
 * Also deletes all reviews for that business
 */
export async function deleteBusiness(req, res) {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    let ownerId = business.owner_id || business.owner;

    if (!ownerId) {
      // no owner recorded: only current user can "claim & delete"
      business.owner_id = req.user._id;
      ownerId = req.user._id;
    }

    if (ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this business" });
    }

    await Review.deleteMany({ business: business._id });
    await business.deleteOne();

    res.json({ message: "Business deleted" });
  } catch (err) {
    console.error("deleteBusiness error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
