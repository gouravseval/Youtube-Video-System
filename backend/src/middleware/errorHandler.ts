import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: err.data,
        });
    }

    // Handle generic errors
    console.error("Unhandle Error:", err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: [],
    });
};
