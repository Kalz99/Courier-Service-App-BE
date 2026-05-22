import { z } from "zod";
import { shipmentRepository } from "../repository/shipment.repository.js";
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

const updateShipmentStatusSchema = z.object({
    id: z.string({ message: "Shipment ID is required" }).trim().min(1, "Shipment ID must be valid"),
    status: z.enum(["Pending", "In Transit", "Out for Delivery", "Delivered", "Cancelled"], {
        message: "Invalid shipment status. Allowed values: Pending, In Transit, Out for Delivery, Delivered, Cancelled"
    })
});

export async function updateShipmentStatus(id: string, status: string): Promise<ShipmentRow> {
    const parseResult = updateShipmentStatusSchema.safeParse({ id, status });
    if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]?.message || "Validation error";
        throw new AppError(firstError, 400);
    }

    const updatedShipment = await shipmentRepository.updateStatus(parseResult.data.id, parseResult.data.status);
    if (!updatedShipment) {
        throw new AppError("Shipment not found", 404);
    }

    return updatedShipment;
}

