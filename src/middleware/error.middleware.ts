import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // 1. Handle our custom operational errors (like 400 Bad Request, 404 Not Found)
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }

    // 2. Handle unexpected system crashes (500 Internal Server Error)
    console.error("❌ UNHANDLED CRITICAL ERROR:", error);
    
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred on the server.",
    });
};
