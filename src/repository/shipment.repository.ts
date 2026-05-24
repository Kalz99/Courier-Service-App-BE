import pool from "../config/db.js";
import type { ShipmentRow, CreateShipmentInput } from "../types/shipment.types.js";

export class ShipmentRepository {

    private static readonly FIND_BY_USER_ID_AND_TRACKING = `
        SELECT id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at 
        FROM shipments 
        WHERE user_id = $1 AND tracking_number ILIKE $2
        ORDER BY created_at DESC
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

    async getStatusHistoryByTrackingNumber(trackingNumber: string): Promise<any[]> {
        const result = await pool.query(
            ShipmentRepository.FIND_STATUS_HISTORY_BY_TRACKING,
            [trackingNumber.trim().toUpperCase()]
        );
        return result.rows;
    }
}

export const shipmentRepository = new ShipmentRepository();
