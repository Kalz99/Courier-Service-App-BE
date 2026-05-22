import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRY } from "../config/jwt.js";

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Generates a short-lived access token
 */
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Generates a long-lived refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
}

/**
 * Verifies an access token and returns its decoded payload
 */
export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

/**
 * Verifies a refresh token and returns its decoded payload
 */
export function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}
