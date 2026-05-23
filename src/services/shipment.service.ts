import { z } from "zod";
import { shipmentRepository } from "../repository/shipment.repository.js";
import { shipmentTrackingRepository } from "../repository/shipmentTracking.repository.js";
import type { ShipmentRow, CreateShipmentDTO } from "../types/shipment.types.js";
import { AppError } from "../utils/errors.js";
import { createShipmentBodySchema } from "../validations/shipment.validation.js";



export async function searchShipments(trackingNumber: string): Promise<ShipmentRow | null> {
    if (!trackingNumber || typeof trackingNumber !== "string" || trackingNumber.trim() === "") {
        throw new AppError("A valid tracking number is required", 400);
    }
    return await shipmentRepository.findByTrackingNumber(trackingNumber);
}

export async function trackShipment(trackingNumber: string): Promise<any[]> {
    if (
        !trackingNumber ||
        typeof trackingNumber !== "string" ||
        trackingNumber.trim() === ""
    ) {
        throw new AppError("A valid tracking number is required", 400);
    }
    const history = await shipmentRepository.getStatusHistoryByTrackingNumber(trackingNumber);
    if (!history || history.length === 0) {
        throw new AppError("No tracking history found for this shipment", 404);
    }
    return history;
}
