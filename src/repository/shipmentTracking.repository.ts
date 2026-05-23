import pool from "../config/db.js";

export class ShipmentTrackingRepository {
    private static readonly INSERT_STATUS_HISTORY = `
        INSERT INTO shipment_status_history (shipment_id, status, updated_by)
        VALUES ($1, $2, $3)
    `;

    async insertStatusHistory(shipmentId: string, status: string, updatedBy: string): Promise<void> {
        await pool.query(ShipmentTrackingRepository.INSERT_STATUS_HISTORY, [shipmentId, status, updatedBy]);
    }
}

export const shipmentTrackingRepository = new ShipmentTrackingRepository();
