import { Router } from "express";
import {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} from "../controllers/plant.controller.js";

import { upload } from "../middlewares/multer.middleware.js"; // 👈 multer import

const plantRouter = Router();

// CRUD endpoints
plantRouter.post("/", upload.single("image"), createPlant); //file upload ke liye middleware add
plantRouter.get("/", getAllPlants);
plantRouter.get("/:id", getPlantById);
plantRouter.put("/:id", upload.single("image"), updatePlant); 
plantRouter.delete("/:id", deletePlant);

export default plantRouter;
