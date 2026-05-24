import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/errors.js";
import { generateAccessToken, verifyRefreshToken } from "../utils/token.js";


export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user,
            accessToken,
        },
    });
});


export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user,
            accessToken,
        },
    });
});



export const refresh = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError("Refresh token not found", 401);
    }

    try {
        const payload = verifyRefreshToken(refreshToken);

        const newAccessToken = generateAccessToken({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error: unknown) {

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        throw new AppError("Invalid or expired refresh token", 401);
    }
});



export const logout = catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});
