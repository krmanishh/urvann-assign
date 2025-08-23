import { Router } from "express";
import { sendOTP, verifyOTP } from "../controllers/auth.controller.js";

const authRouter = Router();

// Step 1: Request OTP
authRouter.post("/request-otp", sendOTP);

// Step 2: Verify OTP
authRouter.post("/verify-otp", verifyOTP);

export default authRouter;
