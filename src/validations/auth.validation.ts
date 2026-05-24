import { z } from "zod";

// Registration validation schema
export const registerSchema = z.object({
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
    phone: z.string({ message: "Phone number is required" })
        .trim()
        .min(1, "Phone number is required"),
    role: z.string().trim().optional(),
});

// Login validation schema
export const loginSchema = z.object({
    email: z.string({ message: "Email is required" })
        .trim()
        .min(1, "Email is required!"),
    password: z.string({ message: "Password is required" })
        .min(1, "Password is required!"),
});
