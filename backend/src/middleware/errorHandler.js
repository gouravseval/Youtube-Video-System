import { ApiError } from "../utils/ApiError.js";

/**
 * Global Express error-handling middleware.
 * Must be registered AFTER all routes in app.js / index.js:
 *
 *   app.use(errorHandler);
 *
 * Catches:
 *  - ApiError instances thrown from controllers
 *  - Generic JS errors / unhandled async rejections
 */
export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  // Fallback for unexpected errors
  console.error("[Unhandled Error]", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    errors: [],
  });
};
