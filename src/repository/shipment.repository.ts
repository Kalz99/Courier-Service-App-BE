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

    private static readonly FIND_STATUS_HISTORY_BY_TRACKING = `
        SELECT ssh.id, ssh.shipment_id, ssh.status, ssh.updated_by, ssh.created_at 
        FROM shipment_status_history ssh 
        JOIN shipments s ON ssh.shipment_id = s.id 
        WHERE s.tracking_number = $1 
        ORDER BY ssh.created_at DESC
    `;

    private static readonly INSERT_STATUS_HISTORY = `
    INSERT INTO shipment_status_history (shipment_id, status, updated_by)
    VALUES ($1, $2, $3);
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

    private static readonly FIND_BY_USER_ID_AND_TRACKING = `
        SELECT id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at 
        FROM shipments 
        WHERE user_id = $1 AND tracking_number ILIKE $2
        ORDER BY created_at DESC
    `;

    async findByUserId(userId: string): Promise<ShipmentRow[]> {
        const result = await pool.query(
            ShipmentRepository.FIND_BY_USER_ID,
            [userId]
        );
        return result.rows;
    }

    async findByUserIdAndTracking(userId: string, tracking: string): Promise<ShipmentRow[]> {
        const result = await pool.query(
            ShipmentRepository.FIND_BY_USER_ID_AND_TRACKING,
            [userId, `%${tracking}%`]
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


    async updateStatus(id: string, status: string, updatedBy?: string): Promise<ShipmentRow | null> {
        const result = await pool.query(
            ShipmentRepository.UPDATE_STATUS,
            [status, id]
        );
        const updated = result.rows[0] || null;
        if (updated) {
            await this.insertStatusHistory(updated.id, updated.status, updatedBy || updated.user_id);
        }
        return updated;
    }

    async insertStatusHistory(shipmentId: string, status: string, updatedBy: string): Promise<void> {
        await pool.query(
            ShipmentRepository.INSERT_STATUS_HISTORY,
            [shipmentId, status, updatedBy]
        );
    }

    async getStatusHistoryByTrackingNumber(trackingNumber: string): Promise<any[]> {
        const result = await pool.query(
            ShipmentRepository.FIND_STATUS_HISTORY_BY_TRACKING,
            [trackingNumber.trim().toUpperCase()]
        );
        return result.rows;
    }
}

export const shipmentRepository = new ShipmentRepository();
