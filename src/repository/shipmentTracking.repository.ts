import pool from "../config/db.js";

export class ShipmentTrackingRepository {
    private static readonly INSERT_STATUS_HISTORY = `
        INSERT INTO shipment_status_history (shipment_id, status, updated_by)
        VALUES ($1, $2, $3)
    `;

    async insertStatusHistory(shipmentId: string, status: string, updatedBy: string): Promise<void> {
        await pool.query(ShipmentTrackingRepository.INSERT_STATUS_HISTORY, [shipmentId, status, updatedBy]);
    }

    private static readonly GET_ALL_STATUS_COUNTS = `
        SELECT status, COUNT(*)::int as count 
        FROM shipment_status_history 
        GROUP BY status
    `;

    private static readonly GET_USER_STATUS_COUNTS = `
        SELECT ssh.status, COUNT(*)::int as count 
        FROM shipment_status_history ssh
        JOIN shipments s ON ssh.shipment_id = s.id
        WHERE s.user_id = $1
        GROUP BY ssh.status
    `;

    async getStatusCounts(): Promise<{ status: string; count: number }[]> {
        const result = await pool.query(ShipmentTrackingRepository.GET_ALL_STATUS_COUNTS);
        return result.rows;
    }

    async getStatusCountsByUserId(userId: string): Promise<{ status: string; count: number }[]> {
        const result = await pool.query(ShipmentTrackingRepository.GET_USER_STATUS_COUNTS, [userId]);
        return result.rows;
    }
}


export const shipmentTrackingRepository = new ShipmentTrackingRepository();
