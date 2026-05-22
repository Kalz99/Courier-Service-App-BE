import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { DecodedToken, AuthenticatedRequest } from "../types/auth.types.js";
import { JWT_SECRET } from "../config/jwt.js";

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied. Malformed token." });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
}

