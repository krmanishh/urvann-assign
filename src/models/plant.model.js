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
      type: [String], // ✅ multiple categories allowed
      required: [true, "At least one category is required"],
      enum: [
        "Indoor",
        "Outdoor",
        "Succulent",
        "Air Purifying",
        "Home Decor",
        "Flowering",
        "Medicinal",
      ],
    },
    inStock: {
      type: Boolean,
      default: true, // ✅ true = In Stock
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Plant = mongoose.model("Plant", plantSchema);
