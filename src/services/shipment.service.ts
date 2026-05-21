import { z } from "zod";
import { shipmentRepository } from "../repository/shipment.repository.js";
import type { ShipmentRow, CreateShipmentDTO } from "../types/shipment.types.js";
import { AppError } from "../utils/errors.js";

const createShipmentSchema = z.object({
    recipientName: z.string({ message: "Recipient name is required" })
        .trim()
        .min(1, "Recipient name is required"),
    recipientAddress: z.string({ message: "Recipient address is required" })
        .trim()
        .min(1, "Recipient address is required"),
    recipientPhoneNumber: z.string({ message: "Recipient phone number is required" })
        .trim()
        .min(1, "Recipient phone number is required"),
    shipmentType: z.string({ message: "Shipment type is required" })
        .trim()
        .min(1, "Shipment type is required"),
    weight: z.number({ message: "Weight must be a number" })
        .positive("Weight must be greater than zero"),
    userId: z.number({ message: "User ID is required" })
        .int("User ID must be an integer")
        .positive("User ID must be valid"),
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

    const shipment = await shipmentRepository.createShipment({
        trackingNumber,
        recipientName,
        recipientAddress,
        recipientPhoneNumber,
        shipmentType,
        weight,
        userId,
    });

    return shipment;
}
