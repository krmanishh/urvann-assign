import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js"; 
const cartRouter = Router();

cartRouter.post("/add", verifyJWT, addToCart);
cartRouter.get("/", verifyJWT, getCart);
cartRouter.post("/remove", verifyJWT, removeFromCart);
cartRouter.post("/clear", verifyJWT, clearCart);

export default cartRouter;