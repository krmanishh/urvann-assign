import { Router } from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔹 Register
router.post("/register", registerUser);

// 🔹 Login
router.post("/login", loginUser);

// 🔹 OTP Login Flow
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// 🔹 Secure Routes (JWT protected)
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/current-user", verifyJWT, getCurrentUser);
router.patch("/update-account", verifyJWT, updateAccountDetails);

export default router;

