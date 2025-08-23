import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🔹 Send OTP
export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  let user = await User.findOne({ email });
  if (!user) {
    // Agar user nahi hai to register kar do (passwordless flow)
    user = await User.create({
      email,
      username: email.split("@")[0],
      fullName: email.split("@")[0],
    });
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min valid

  user.otp = { code: otpCode, expiresAt: otpExpiry };
  await user.save({ validateBeforeSave: false });

  await sendEmail(email, "Your OTP Code", `Your OTP is ${otpCode}`);

  return res.status(200).json(new ApiResponse(200, {}, "OTP sent to email"));
});

// 🔹 Verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, "Email & OTP are required");

  const user = await User.findOne({ email });
  if (!user || !user.otp?.code)
    throw new ApiError(400, "No OTP found, please request again");

  if (user.otp.expiresAt < Date.now()) throw new ApiError(400, "OTP expired");
  if (user.otp.code !== otp) throw new ApiError(400, "Invalid OTP");

  // OTP valid → clear it
  user.otp = { code: null, expiresAt: null };
  await user.save({ validateBeforeSave: false });

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "OTP verified, logged in successfully"
      )
    );
});
