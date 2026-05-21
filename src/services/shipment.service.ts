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

export async function getShipments(userId: string): Promise<ShipmentRow[]> {
    if (!userId) {
        throw new AppError("A valid user ID is required", 400);
    }
    return await shipmentRepository.findByUserId(userId);
}

export async function findByUserId(userId: string): Promise<ShipmentRow[]> {
    if (!userId) {
        throw new AppError("A valid user ID is required", 400);
    }
    return await shipmentRepository.findByUserId(userId);
}


export async function searchShipments(trackingNumber: string): Promise<ShipmentRow | null> {
    console.log(typeof trackingNumber);
    if (!trackingNumber || typeof trackingNumber !== "string" || trackingNumber.trim() === "") {
        throw new AppError("A valid tracking number is required", 400);
    }

    return await shipmentRepository.findByTrackingNumber(trackingNumber);
}
