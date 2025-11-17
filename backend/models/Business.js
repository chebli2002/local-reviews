import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    category_id: { type: String, required: true },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⬇️ ADD THESE TWO FIELDS
    google_map_url: { type: String },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Business", businessSchema);
