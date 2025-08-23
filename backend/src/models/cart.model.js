import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
  plant: {
    type: Schema.Types.ObjectId,
    ref: "Plant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);


export const Cart = mongoose.model("Cart", cartSchema);
