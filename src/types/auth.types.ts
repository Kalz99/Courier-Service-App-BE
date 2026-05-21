import type { Request } from "express";

export interface UserRow {
    id: number;
    name: string;
    email: string;
    password?: string;
    address: string | null;
    business_name: string | null;
    phone: string;
    role: string;
    created_at?: Date;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    address: string | null;
    businessName: string | null;
    phone: string;
    role: string;
}

export interface AuthResponse {
    user: UserResponse;
    token: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    address?: string | undefined;
    businessName?: string | undefined;
    phone: string;
    role?: string | undefined;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface DecodedToken {
    userId: number;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

