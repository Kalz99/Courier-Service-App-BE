import pool from "../config/db.js";
import type { ShipmentRow, CreateShipmentInput } from "../types/shipment.types.js";

export class ShipmentRepository {
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

    private static readonly FIND_ALL = `
        SELECT id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at 
        FROM shipments 
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
    `;

    private static readonly UPDATE_STATUS = `
        UPDATE shipments 
        SET status = $1 
        WHERE id = $2 
        RETURNING id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at
    `;

    private static readonly FIND_BY_TRACKING_NUMBER = `
        SELECT id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at 
        FROM shipments 
        WHERE tracking_number = $1
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
            ShipmentRepository.CREATE_SHIPMENT,
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
        const result = await pool.query(
            ShipmentRepository.FIND_BY_USER_ID,
            [userId]
        );
        return result.rows;
    }

    async findByTrackingNumber(trackingNumber: string): Promise<ShipmentRow | null> {
        const result = await pool.query(
            ShipmentRepository.FIND_BY_TRACKING_NUMBER,
            [trackingNumber.trim().toUpperCase()]
        );
        return result.rows[0] || null;
    }


    async findAll(limit: number = 10, offset: number = 0): Promise<ShipmentRow[]> {
        const result = await pool.query(
            ShipmentRepository.FIND_ALL,
            [limit, offset]
        );
        return result.rows;
    }


    async updateStatus(id: string, status: string): Promise<ShipmentRow | null> {
        const result = await pool.query(
            ShipmentRepository.UPDATE_STATUS,
            [status, id]
        );
        return result.rows[0] || null;
    }
}

export const shipmentRepository = new ShipmentRepository();
