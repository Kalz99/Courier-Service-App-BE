import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRY = (process.env.JWT_EXPIRY || "1d") as any;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
