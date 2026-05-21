import pool from "../config/db.js";
import type { UserRow } from "../types/auth.types.js";

export class AuthRepository {

    async findByEmail(email: string): Promise<UserRow | null> {
        const result = await pool.query(
            `SELECT id, name, email, password, address, business_name, phone_number AS phone, role, created_at 
       FROM users 
       WHERE email = $1`,
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
        phone?: string | undefined;
        role?: string | undefined;
    }): Promise<UserRow> {
        const {
            name,
            email,
            passwordHash,
            address = null,
            businessName = null,
            phone = null,
            role = "customer",
        } = userData;

        const result = await pool.query(
            `INSERT INTO users (name, email, password, address, business_name, phone_number, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, name, email, address, business_name, phone_number AS phone, role, created_at`,
            [name, email.toLowerCase(), passwordHash, address, businessName, phone, role]
        );

        return result.rows[0];
    }
}

export const authRepository = new AuthRepository();
