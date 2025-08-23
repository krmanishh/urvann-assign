import { Router } from "express";
import { sendOtp, verifyOtp, refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

// 🔹 OTP-only login flow
router.post("/send-otp", sendOtp); // request OTP & auto-register
router.post("/verify-otp", verifyOtp); // verify OTP & login
router.post("/refresh-token", refreshAccessToken); // refresh JWT

export default router;
