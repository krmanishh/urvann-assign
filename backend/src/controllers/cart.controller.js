import { Cart } from "../models/cart.model.js";
import { Plant } from "../models/plant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🔹 Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { plantId, quantity } = req.body;
  const userId = req.user?._id; // ✅ safe check

  if (!plantId) throw new ApiError(400, "Plant ID is required");
  if (quantity && quantity <= 0)
    throw new ApiError(400, "Quantity must be greater than 0");

  const plant = await Plant.findById(plantId);
  if (!plant) throw new ApiError(404, "Plant not found");

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ plant: plantId, quantity: quantity || 1 }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.plant.toString() === plantId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ plant: plantId, quantity: quantity || 1 });
    }
  }

  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

// 🔹 Get user cart
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const cart = await Cart.findOne({ user: userId }).populate("items.plant");
  if (!cart)
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Cart is empty"));

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// 🔹 Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { plantId } = req.body;
  const userId = req.user?._id;

  if (!plantId) throw new ApiError(400, "Plant ID is required");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.plant.toString() !== plantId);

  if (cart.items.length === initialLength)
    throw new ApiError(404, "Item not found in cart");

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart"));
});

// 🔹 Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export { addToCart, getCart, removeFromCart, clearCart };
