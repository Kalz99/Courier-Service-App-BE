import bcrypt from "bcrypt";
import { authRepository } from "../repository/auth.repository.js";
import { AppError } from "../utils/errors.js";
import type { UserRow, UserResponse, AuthResponse, RegisterInput, LoginInput } from "../types/auth.types.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";



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

    const tokenPayload = {
        userId: newUserResponse.id,
        email: newUserResponse.email,
        role: newUserResponse.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
        user: newUserResponse,
        accessToken,
        refreshToken,
    };
}


export async function loginUser(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    const user = await authRepository.findByEmail(email);
    if (!user || !user.password) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const userResponse = mapToUserResponse(user);

    const tokenPayload = {
        userId: userResponse.id,
        email: userResponse.email,
        role: userResponse.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
        user: userResponse,
        accessToken,
        refreshToken,
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
