import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const authData = await authService.registerUser(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: authData,
    });
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const authData = await authService.loginUser(req.body);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: authData,
    });
});
