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
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${datePart}-${randomPart}`;
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
