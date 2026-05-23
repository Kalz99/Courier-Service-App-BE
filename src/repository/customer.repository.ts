import pool from "../config/db.js";
import type { ShipmentRow, CreateShipmentInput } from "../types/shipment.types.js";

export class CustomerRepository {
    private static readonly CREATE_SHIPMENT = `
        INSERT INTO shipments (
            tracking_number, 
            recipient_name, 
            recipient_address, 
            recipient_phone_number, 
            shipment_type, 
            weight, 
            status, 
            user_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at
    `;

    private static readonly FIND_BY_USER_ID = `
        SELECT id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at 
        FROM shipments 
        WHERE user_id = $1 
        ORDER BY created_at DESC
    `;

    async createShipment(input: CreateShipmentInput): Promise<ShipmentRow> {
        const {
            trackingNumber,
            recipientName,
            recipientAddress,
            recipientPhoneNumber,
            shipmentType,
            weight,
            status = "Pending",
            userId,
        } = input;

        const result = await pool.query(
            CustomerRepository.CREATE_SHIPMENT,
            [
                trackingNumber,
                recipientName,
                recipientAddress,
                recipientPhoneNumber,
                shipmentType,
                weight,
                status,
                userId,
            ]
        );

        return result.rows[0];
    }

    async findByUserId(userId: string): Promise<ShipmentRow[]> {
        const result = await pool.query(CustomerRepository.FIND_BY_USER_ID, [userId]);
        return result.rows;
    }
}

export const customerRepository = new CustomerRepository();
