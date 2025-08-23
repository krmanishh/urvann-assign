import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// 🔹 Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 🔹 Send Email
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
};

// 🔹 Generate Access & Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found while generating tokens");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// 🔹 Send OTP & auto-register if user doesn't exist
const sendOtp = asyncHandler(async (req, res) => {
  const { email, username, fullName, role } = req.body;
  if (!(email || username)) throw new ApiError(400, "Email or Username is required");

  let user = await User.findOne({ email });

  if (!user) {
    // ✅ First-time registration requires extra details
    if (!username || !fullName)
      throw new ApiError(
        400,
        "Username and Full Name are required for registration"
      );

    user = await User.create({
      email,
      username,
      fullName,
      role: role || "user",
    });
  }

  const otp = generateOTP();
  user.otpCode = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
  await user.save();

  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP is ${otp}. It will expire in 5 minutes.`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

// 🔹 Verify OTP & login
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, username, otp } = req.body;
  if (!(email || username) || !otp) throw new ApiError(400, "Email or Username and OTP are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.otpCode !== otp || user.otpExpiry < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.otpCode = null;
  user.otpExpiry = null;

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      },
      "OTP verified, login successful"
    )
  );
});

// 🔹 Refresh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded._id);

    if (!user) throw new ApiError(404, "Invalid refresh token");
    if (incomingRefreshToken !== user.refreshToken)
      throw new ApiError(401, "Refresh token expired or invalid");

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

export { sendOtp, verifyOtp, refreshAccessToken };
