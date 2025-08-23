import { Plant } from "../models/plant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

// 🔹 Create Plant
// Create Plant
const createPlant = asynchandler(async (req, res) => {
  let { name, price, categories, inStock, description } = req.body;

  if (!name || !price) {
    throw new ApiError(400, "Name and Price are required");
  }

  // Ensure categories is array
  if (categories && !Array.isArray(categories)) {
    categories = [categories];
  }

  // multer se file ka path lena
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const plant = await Plant.create({
    name,
    price,
    categories,
    inStock,
    description,
    imageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, plant, "✅ Plant created successfully"));
});

// 🔹 Get All Plants (with optional filters)
const getAllPlants = asynchandler(async (req, res) => {
  const { category, inStock } = req.query;

  let filter = {};
  if (category) {
    filter.categories = { $regex: category, $options: "i" }; // case-insensitive search
  }
  if (inStock !== undefined) {
    filter.inStock = inStock === "true";
  }

  const plants = await Plant.find(filter);

  return res
    .status(200)
    .json(new ApiResponse(200, plants, "✅ Plants fetched successfully"));
});

// 🔹 Get Single Plant
const getPlantById = asynchandler(async (req, res) => {
  const { id } = req.params;

  const plant = await Plant.findById(id);
  if (!plant) throw new ApiError(404, "❌ Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, plant, "✅ Plant fetched successfully"));
});

// 🔹 Update Plant (Partial Update Allowed)
const updatePlant = asynchandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  // Ensure categories is array if provided
  if (updateData.categories && !Array.isArray(updateData.categories)) {
    updateData.categories = [updateData.categories];
  }

  const plant = await Plant.findByIdAndUpdate(id, { $set: updateData }, { new: true });

  if (!plant) throw new ApiError(404, "❌ Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, plant, "✅ Plant updated successfully"));
});

// 🔹 Delete Plant
const deletePlant = asynchandler(async (req, res) => {
  const { id } = req.params;

  const plant = await Plant.findByIdAndDelete(id);
  if (!plant) throw new ApiError(404, "❌ Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "✅ Plant deleted successfully"));
});

export { createPlant, getAllPlants, getPlantById, updatePlant, deletePlant };
