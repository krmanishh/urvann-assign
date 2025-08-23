import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// 🔹 Generate Access & Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found while generating tokens");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// ✅ OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send Email Function
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

// 🔹 Register User (Password Based)
const registerUser = asynchandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatar = req.files?.avatar?.[0]?.path || "";
  const coverImage = req.files?.coverImage?.[0]?.path || "";

  const user = await User.create({
    fullName,
    email,
    username,
    password,
    avatar,
    coverImage,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// 🔹 Login User (Password Based)
const loginUser = asynchandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const username = req.body.username?.trim().toLowerCase();
  const password = req.body.password;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Wrong password");

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// 🔹 Send OTP (Email Based Login Step 1)
const sendOtp = asynchandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  let user = await User.findOne({ email });
  if (!user) {
    // agar user nahi mila toh create kar do
    user = await User.create({
      email,
      username: email.split("@")[0],
      fullName: "New User",
    });
  }

  const otp = generateOTP();
  user.otpCode = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
  await user.save();

  await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}. It will expire in 5 minutes.`);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

// 🔹 Verify OTP (Email Based Login Step 2)
const verifyOtp = asynchandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.otpCode !== otp || user.otpExpiry < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // OTP clear
  user.otpCode = null;
  user.otpExpiry = null;

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

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

// 🔹 Logout User
const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// 🔹 Refresh Access Token
const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(404, "Invalid refresh token");
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid");
    }

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
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// 🔹 Change Password
const changeCurrentPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// 🔹 Get Current User
const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// 🔹 Update Account Details
const updateAccountDetails = asynchandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(
      400,
      "At least one field (fullName or email) is required"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { ...(fullName && { fullName }), ...(email && { email }) } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

export {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
};
