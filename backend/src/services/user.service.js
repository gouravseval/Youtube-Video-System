import { AppDataSource } from "../db/data-source.js";
import { UserEntity } from "../models/user.entity.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

class UserService {
    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    generateAccessToken(user) {
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
    }

    generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user.id,
            },
            process.env.REFRESH_TOKEN_SECRET || "refresh_secret_123",
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
            }
        );
    }

    async registerUser({ username, email, password }) {
        if ([username, email, password].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const hash = await hashPassword(password);
        if (!hash) {
            throw new ApiError(500, "Unable to hash password");
        }

        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new ApiError(409, "User with this email already exists");
        }

        const user = this.userRepository.create({
            username,
            password: hash,
            email,
        });
        await this.userRepository.save(user);

        return { id: user.id, username, email };
    }

    async loginUser({ email, password }) {
        if ([email, password].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "Email and password are required");
        }

        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await this.userRepository.save(user);

        const loggedInUser = await this.userRepository.findOne({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        return { user: loggedInUser, accessToken, refreshToken };
    }
}

export const userService = new UserService();
