import { Plant } from "../models/plant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

// 🔹 Create Plant
const createPlant = asynchandler(async (req, res) => {
  const { name, price, categories, inStock, description, imageUrl } = req.body;

  if (!name || !price) {
    throw new ApiError(400, "Name and Price are required");
  }

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
    .json(new ApiResponse(201, plant, "Plant created successfully"));
});

// 🔹 Get All Plants (with optional filters)
const getAllPlants = asynchandler(async (req, res) => {
  const { category, inStock } = req.query;

  let filter = {};
  if (category) filter.categories = category;
  if (inStock !== undefined) filter.inStock = inStock === "true";

  const plants = await Plant.find(filter);

  return res
    .status(200)
    .json(new ApiResponse(200, plants, "Plants fetched successfully"));
});

// 🔹 Get Single Plant
const getPlantById = asynchandler(async (req, res) => {
  const { id } = req.params;

  const plant = await Plant.findById(id);
  if (!plant) throw new ApiError(404, "Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, plant, "Plant fetched successfully"));
});

// 🔹 Update Plant
const updatePlant = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, categories, inStock, description, imageUrl } = req.body;

  const plant = await Plant.findByIdAndUpdate(
    id,
    { $set: { name, price, categories, inStock, description, imageUrl } },
    { new: true }
  );

  if (!plant) throw new ApiError(404, "Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, plant, "Plant updated successfully"));
});

// 🔹 Delete Plant
const deletePlant = asynchandler(async (req, res) => {
  const { id } = req.params;

  const plant = await Plant.findByIdAndDelete(id);
  if (!plant) throw new ApiError(404, "Plant not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Plant deleted successfully"));
});

export { createPlant, getAllPlants, getPlantById, updatePlant, deletePlant };
