import { Router } from "express";
import {
  createPlant,
  getAllPlants,
  getPlantById,
  updatePlant,
  deletePlant,
} from "../controllers/plant.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const plantRouter = Router();

// ✅ CRUD endpoints

// Public routes
plantRouter.get("/", getAllPlants);
plantRouter.get("/:id", getPlantById);

// Protected + Admin-only routes
plantRouter.post(
  "/",
  verifyJWT,
  verifyAdmin,
  upload.single("image"),
  createPlant
);

plantRouter.put(
  "/:id",
  verifyJWT,
  verifyAdmin,
  upload.single("image"),
  updatePlant
);

plantRouter.delete("/:id", verifyJWT, verifyAdmin, deletePlant);

export default plantRouter;
