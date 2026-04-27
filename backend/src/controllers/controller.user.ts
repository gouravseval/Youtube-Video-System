import { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class UserController {
    async signUp(req: Request, res: Response) {
        const userData = await userService.registerUser({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, userData, "User created successfully"));
    }

    async login(req: Request, res: Response) {
        const { user, accessToken, refreshToken } = await userService.loginUser({
            email: req.body.email,
            password: req.body.password,
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
                        user,
                        accessToken,
                        refreshToken,
                    },
                    "Logged in successfully"
                )
            );
    }
}

export const userController = new UserController();
