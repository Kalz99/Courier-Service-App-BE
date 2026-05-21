import pool from "../config/db.js";
import type { UserRow } from "../types/auth.types.js";

export class AuthRepository {
    private static readonly FIND_BY_EMAIL = `
        SELECT id, name, email, password, address, business_name, phone_number AS phone, role, created_at 
        FROM users 
        WHERE email = $1
    `;

    private static readonly CREATE_USER = `
        INSERT INTO users (name, email, password, address, business_name, phone_number, role) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id, name, email, address, business_name, phone_number AS phone, role, created_at
    `;

    async findByEmail(email: string): Promise<UserRow | null> {
        const result = await pool.query(
            AuthRepository.FIND_BY_EMAIL,
            [email.toLowerCase()]
        );
        return result.rows[0] || null;
    }

    async createUser(userData: {
        name: string;
        email: string;
        passwordHash: string;
        address?: string | undefined;
        businessName?: string | undefined;
        phone: string;
        role?: string | undefined;
    }): Promise<UserRow> {
        const {
            name,
            email,
            passwordHash,
            address = null,
            businessName = null,
            phone,
            role = "customer",
        } = userData;

        const result = await pool.query(
            AuthRepository.CREATE_USER,
            [name, email.toLowerCase(), passwordHash, address, businessName, phone, role]
        );

        return result.rows[0];
    }
}

export const authRepository = new AuthRepository();
