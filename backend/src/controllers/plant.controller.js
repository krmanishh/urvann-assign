import { Plant } from "../models/plant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlant = asyncHandler(async (req, res) => {
  let { name, price, categories, inStock, description } = req.body;

  if (!name || !price || !categories || !inStock || !description) {
    throw new ApiError(
      400,
      "Name, Price, Categories, InStock and Description are required"
    );
  }

  if (categories && !Array.isArray(categories)) {
    categories = [categories];
  }

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

// 🔹 Get All Plants (with search & filters)
const getAllPlants = asyncHandler(async (req, res) => {
  const { search, category, inStock } = req.query;

  let filter = {};

  // 🔎 Case-insensitive search by name OR categories
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { categories: { $regex: search, $options: "i" } },
    ];
  }

  // 🎯 Filter by category (dropdown exact match, but case-insensitive)
  if (category) {
    filter.categories = { $regex: `^${category}$`, $options: "i" };
  }

  // 📦 Filter by stock availability
  if (inStock !== undefined) {
    filter.inStock = inStock === "true";
  }

  const plants = await Plant.find(filter).sort({ name: 1 }); // sort alphabetically

  return res
    .status(200)
    .json(new ApiResponse(200, plants, "✅ Plants fetched successfully"));
});

// 🔹 Get Single Plant
const getPlantById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const plant = await Plant.findById(id);
  if (!plant) throw new ApiError(404, "❌ Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, plant, "✅ Plant fetched successfully"));
});

// 🔹 Update Plant
const updatePlant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  if (updateData.categories && !Array.isArray(updateData.categories)) {
    updateData.categories = [updateData.categories];
  }

  const plant = await Plant.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );

  if (!plant) throw new ApiError(404, "❌ Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, plant, "✅ Plant updated successfully"));
});

// 🔹 Delete Plant
const deletePlant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const plant = await Plant.findByIdAndDelete(id);
  if (!plant) throw new ApiError(404, "❌ Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "✅ Plant deleted successfully"));
});

export { createPlant, getAllPlants, getPlantById, updatePlant, deletePlant };
