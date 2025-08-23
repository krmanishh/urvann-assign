import { Router } from "express";
import {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} from "../controllers/plant.controller.js";

const router = Router();

// CRUD endpoints
router.post("/", createPlant);
router.get("/", getAllPlants);
router.get("/:id", getPlantById);
router.put("/:id", updatePlant);
router.delete("/:id", deletePlant);

export default router;
