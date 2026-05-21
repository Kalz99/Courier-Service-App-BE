import pool from "../config/db.js";

export interface ShipmentRow {
    id: string;
    tracking_number: string;
    recipient_name: string;
    recipient_address: string;
    recipient_phone_number: string;
    shipment_type: string;
    weight: number;
    status: string;
    user_id: number;
    created_at: Date;
}

export interface CreateShipmentInput {
    trackingNumber: string;
    recipientName: string;
    recipientAddress: string;
    recipientPhoneNumber: string;
    shipmentType: string;
    weight: number;
    status?: string;
    userId: number;
}

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
    `;

    private static readonly UPDATE_STATUS = `
        UPDATE shipments 
        SET status = $1 
        WHERE id = $2 
        RETURNING id, tracking_number, recipient_name, recipient_address, recipient_phone_number, shipment_type, weight, status, user_id, created_at
    `;

    /**
     * Inserts a new shipment mapping user_id to the logged-in client.
     */
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

    /**
     * Used by clients to only see their own shipment rows.
     */
    async findByUserId(userId: number): Promise<ShipmentRow[]> {
        const result = await pool.query(
            ShipmentRepository.FIND_BY_USER_ID,
            [userId]
        );
        return result.rows;
    }

    /**
     * Used by administrators to view everything in the system.
     */
    async findAll(): Promise<ShipmentRow[]> {
        const result = await pool.query(ShipmentRepository.FIND_ALL);
        return result.rows;
    }

    /**
     * Used by administrators to change a tracking state.
     * Returns the updated shipment row or null if not found.
     */
    async updateStatus(id: string, status: string): Promise<ShipmentRow | null> {
        const result = await pool.query(
            ShipmentRepository.UPDATE_STATUS,
            [status, id]
        );
        return result.rows[0] || null;
    }
}

export const shipmentRepository = new ShipmentRepository();
