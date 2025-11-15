// backend/models/Business.js
import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    category_id: {
      type: String,
      required: true, // "cat-food", "cat-fitness", "cat-services"
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);

export default Business;
