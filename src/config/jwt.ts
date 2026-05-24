import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRY = (process.env.JWT_EXPIRY || "15m") as any; // Standard access token expiry is typically short (e.g. 15 minutes)

export const JWT_REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET || (JWT_SECRET ? JWT_SECRET + "_refresh" : "")) as string;
export const JWT_REFRESH_EXPIRY = (process.env.JWT_REFRESH_EXPIRY || "7d") as any;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
}
