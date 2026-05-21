import type { Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";

// Registration validation
const registerSchema = z.object({
    name: z.string({ message: "Your name is required" })
        .trim()
        .min(1, "Your name is required"),
    email: z.string({ message: "A valid email is required" })
        .trim()
        .email("A valid email is required"),
    password: z.string({ message: "Password must be at least 6 characters long" })
        .min(6, "Password must be at least 6 characters long"),
    address: z.string({ message: "Address must be a valid text" }).trim().optional(),
    businessName: z.string({ message: "Business name must be a valid text" }).trim().optional(),
    phone: z.string({ message: "Phone must be a valid text" }).trim().optional(),
    role: z.string().trim().optional(),
});



function validateBody<T>(schema: z.Schema<T>, req: Request, res: Response): T | null {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]?.message || "Validation error";
        res.status(400).json({ message: firstError });
        return null;
    }
    return parseResult.data;
}

/**
 * user registration request.
 */
export async function register(req: Request, res: Response): Promise<void> {
    try {
        const validatedData = validateBody(registerSchema, req, res);
        if (!validatedData) return;

        const authData = await authService.registerUser(validatedData);

        res.status(201).json({
            message: "User registered successfully",
            ...authData,
        });
    } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error("Error in registration controller:", error);
        res.status(500).json({ message: "An unexpected error occurred during registration" });
    }
}


