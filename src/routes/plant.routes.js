import { Router } from "express";
import {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} from "../controllers/plant.controller.js";

const plantRouter = Router();

// CRUD endpoints
plantRouter.post("/", createPlant);
plantRouter.get("/", getAllPlants);
plantRouter.get("/:id", getPlantById);
plantRouter.put("/:id", updatePlant);
plantRouter.delete("/:id", deletePlant);

export default plantRouter;
