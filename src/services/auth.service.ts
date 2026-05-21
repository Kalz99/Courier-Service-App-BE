import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "../repository/auth.repository.js";
import { AppError } from "../utils/errors.js";
import type { UserRow, UserResponse, AuthResponse, RegisterInput } from "../types/auth.types.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRY = (process.env.JWT_EXPIRY) as any;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

/**
 * Registers a new user. 
 */
export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
    const { name, email, password, address, businessName, phone, role } = input;

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await authRepository.createUser({
        name,
        email,
        passwordHash: hashedPassword,
        address,
        businessName,
        phone,
        role,
    });

    const newUserResponse = mapToUserResponse(createdUser);

    const token = jwt.sign(
        { userId: newUserResponse.id, email: newUserResponse.email, role: newUserResponse.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );

    return {
        user: newUserResponse,
        token,
    };
}


function mapToUserResponse(user: UserRow): UserResponse {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        businessName: user.business_name,
        phone: user.phone,
        role: user.role,
    };
}
