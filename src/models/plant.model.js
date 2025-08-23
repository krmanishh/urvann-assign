import mongoose, { Schema } from "mongoose";

const plantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Plant name is required"],
      trim: true,
      index: true, // ✅ helps in searching
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    categories: {
      type: [String], // ✅ multiple categories
      required: [true, "At least one category is required"],
      enum: [
        "Indoor",
        "Outdoor",
        "Succulent",
        "Air Purifying",
        "Home Decor",
        "Flowering",
        "Medicinal",
      ], // ✅ restrict to known categories
    },
    availability: {
      type: Boolean,
      default: true, // ✅ true = In Stock
    },
  },
  { timestamps: true }
);

export const Plant = mongoose.model("Plant", plantSchema);
