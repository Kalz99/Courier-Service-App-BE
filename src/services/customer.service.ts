import { z } from "zod";
import { customerRepository } from "../repository/customer.repository.js";
import { shipmentTrackingRepository } from "../repository/shipmentTracking.repository.js";
import type { ShipmentRow, CreateShipmentDTO } from "../types/shipment.types.js";
import { AppError } from "../utils/errors.js";
import { createShipmentBodySchema } from "../validations/shipment.validation.js";

const createShipmentSchema = createShipmentBodySchema.extend({
    userId: z.string({ message: "User ID is required" })
        .trim()
        .min(1, "User ID must be valid"),
});

function generateTrackingNumber(): string {
    const prefix = "TN";
    const digits = Math.floor(100000000 + Math.random() * 900000000).toString();
    return `${prefix}${digits}`;
}

export async function create(dto: CreateShipmentDTO): Promise<ShipmentRow> {
    const parseResult = createShipmentSchema.safeParse(dto);
    if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]?.message || "Validation error";
        throw new AppError(firstError, 400);
    }

    const { recipientName, recipientAddress, recipientPhoneNumber, shipmentType, weight, userId } = parseResult.data;

    const trackingNumber = generateTrackingNumber();

    const shipment = await customerRepository.createShipment({
        trackingNumber,
        recipientName,
        recipientAddress,
        recipientPhoneNumber,
        shipmentType,
        weight,
        userId,
    });

    await shipmentTrackingRepository.insertStatusHistory(
        shipment.id,
        shipment.status,
        shipment.user_id
    );

    return shipment;
}

export async function findByUserId(userId: string): Promise<ShipmentRow[]> {
    if (!userId) {
        throw new AppError("A valid user ID is required", 400);
    }
    return await customerRepository.findByUserId(userId);
}

export async function getMyShipmentStatusCounts(userId: string): Promise<Record<string, number>> {
    if (!userId) {
        throw new AppError("A valid user ID is required", 400);
    }

    const counts = await shipmentTrackingRepository.getStatusCountsByUserId(userId);
    if (!counts) {
        throw new AppError("Failed to retrieve status counts", 500);
    }
    
    const formatted: Record<string, number> = {
        "Pending": 0,
        "In Transit": 0,
        "Out for Delivery": 0,
        "Delivered": 0,
        "Cancelled": 0
    };

    counts.forEach((row) => {
        if (formatted[row.status] !== undefined) {
            formatted[row.status] = row.count;
        }
    });

    return formatted;
}
