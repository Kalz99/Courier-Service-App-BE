import pool from "../config/db.js";
import { shipmentTrackingRepository } from "./shipmentTracking.repository.js";
import type { ShipmentRow } from "../types/shipment.types.js";


export interface CustomerDbRow {
    name: string;
    company: string;
    mobile: string;
    email: string;
    address: string;
    totalPackagesReceived: number;
}


export class AdminRepository {



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


    private static readonly FIND_ALL_SHIPMENTS = `
        SELECT 
            s.id, 
            s.tracking_number, 
            s.recipient_name, 
            s.recipient_address, 
            s.recipient_phone_number, 
            s.shipment_type, 
            s.weight, 
            s.status, 
            s.user_id, 
            s.created_at,
            u.name AS customer_name,         
            u.phone_number AS customer_phone_number,
            u.address AS customer_address
        FROM shipments s
        LEFT JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
        LIMIT $1 OFFSET $2
    `;

    private static readonly UPDATE_SHIPMENT_STATUS = `
        UPDATE shipments 
        SET status = $1 
        WHERE id = $2 
        RETURNING id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at
    `;


    async getAllCustomers(limit?: number, offset?: number): Promise<CustomerDbRow[]> {
        if (limit !== undefined && offset !== undefined) {
            const query = `${AdminRepository.GET_ALL_CUSTOMERS} LIMIT $1 OFFSET $2`;
            const result = await pool.query(query, [limit, offset]);
            return result.rows;
        } else {
            const result = await pool.query(AdminRepository.GET_ALL_CUSTOMERS);
            return result.rows;
        }
    }

    async getTopCustomers(): Promise<any[]> {
        const result = await pool.query(AdminRepository.GET_TOP_CUSTOMERS);
        return result.rows;
    }


    async getAllShipments(limit: number = 10, offset: number = 0): Promise<ShipmentRow[]> {
        const result = await pool.query(AdminRepository.FIND_ALL_SHIPMENTS, [limit, offset]);
        return result.rows;
    }

    async updateShipmentStatus(id: string, status: string, updatedBy?: string): Promise<ShipmentRow | null> {
        const result = await pool.query(AdminRepository.UPDATE_SHIPMENT_STATUS, [status, id]);
        const updated: ShipmentRow | undefined = result.rows[0];
        if (updated) {
            await shipmentTrackingRepository.insertStatusHistory(updated.id, updated.status, updatedBy || updated.user_id);
        }
        return updated ?? null;
    }
}

export const adminRepository = new AdminRepository();
