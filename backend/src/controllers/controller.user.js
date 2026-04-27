import { AppDataSource } from "../db/data-source.js";
import { UserEntity } from "../models/user.entity.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(UserEntity);

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.ACCESS_TOKEN_SECRET || "access_secret_123",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET || "refresh_secret_123",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    }
  );
};

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;

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
  const existingUser = await userRepository.findOneBy({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Create and persist new user
  const user = userRepository.create({
    username,
    password: hash,
    email,
  });
  await userRepository.save(user);

  return res
    .status(201)
    .json(new ApiResponse(201, { id: user.id, username, email }, "User created successfully"));
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await userRepository.save(user);

  const loggedInUser = await userRepository.findOne({
    where: { id: user.id },
    select: {
      id: true,
      username: true,
      email: true
    }
  });

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

