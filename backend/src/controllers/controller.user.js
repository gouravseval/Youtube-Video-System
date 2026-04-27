import { User } from "../models/model.user.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  const currentUser = req.user


  // Validate required fields
  if (
    [username, email, password].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Hash password
  const hash = await hashPassword(password);

  if (!hash) {
    throw new ApiError(500, "Unable to hash password");
  }

  // Check for duplicate account
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Create and persist new user
  const user = await User.create({
    username,
    password: hash,
    email,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { id: user._id, username, email }, "User created successfully"));
};




export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate Tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Logged in successfully"
      )
    );
};

