import pool from "../config/db.js";

export interface CustomerDbRow {
    name: string;
    company: string;
    mobile: string;
    email: string;
    address: string;
    totalPackagesReceived: number;
}

export class CustomerRepository {
    private static readonly GET_ALL_CUSTOMERS = `
        SELECT 
            u.name, 
            COALESCE(u.business_name, '') AS company, 
            COALESCE(u.phone_number, '') AS mobile, 
            u.email, 
            COALESCE(u.address, '') AS address,
            COALESCE(COUNT(s.id), 0)::int AS "totalPackagesReceived"
        FROM users u
        LEFT JOIN shipments s ON u.id = s.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id, u.name, u.business_name, u.phone_number, u.email, u.address, u.created_at
        ORDER BY u.created_at DESC
    `;

    private static readonly GET_TOP_CUSTOMERS = `
        SELECT 
            u.name, 
            COALESCE(u.phone_number, '') AS mobile, 
            COALESCE(u.business_name, '') AS "businessName",
            COUNT(s.id)::int AS "shipmentCount"
        FROM users u
        LEFT JOIN shipments s ON u.id = s.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id, u.name, u.phone_number, u.business_name
        ORDER BY "shipmentCount" DESC
    `;

    async getAllCustomers(): Promise<CustomerDbRow[]> {
        const result = await pool.query(CustomerRepository.GET_ALL_CUSTOMERS);
        return result.rows;
    }

    async getTopCustomers(): Promise<any[]> {
        const result = await pool.query(CustomerRepository.GET_TOP_CUSTOMERS);
        return result.rows;
    }
}

export const customerRepository = new CustomerRepository();
