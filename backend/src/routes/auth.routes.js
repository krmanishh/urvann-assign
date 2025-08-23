import { Router } from "express";
import { requestOtp, verifyOtp } from "../controllers/auth.controller.js";

const router = Router();

// ✅ Step 1: Request OTP
router.post("/request-otp", requestOtp);

// ✅ Step 2: Verify OTP (ye login ka kaam karega)
router.post("/verify-otp", verifyOtp);

export default router;
