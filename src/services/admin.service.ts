import { z } from "zod";
import { adminRepository } from "../repository/admin.repository.js";
import { shipmentTrackingRepository } from "../repository/shipmentTracking.repository.js";
import { AppError } from "../utils/errors.js";
import type { CustomerDbRow } from "../repository/admin.repository.js";
import type { ShipmentRow } from "../types/shipment.types.js";

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------
const updateShipmentStatusSchema = z.object({
    id: z.string({ message: "Shipment ID is required" }).trim().min(1, "Shipment ID must be valid"),
    status: z.enum(["Pending", "In Transit", "Out for Delivery", "Delivered", "Cancelled"], {
        message: "Invalid shipment status. Allowed values: Pending, In Transit, Out for Delivery, Delivered, Cancelled",
    }),
});

// ---------------------------------------------------------------------------
// Customer service functions
// ---------------------------------------------------------------------------
export async function getAllCustomers(): Promise<CustomerDbRow[]> {
    const customers = await adminRepository.getAllCustomers();
    if (!customers) {
        throw new AppError("Failed to retrieve customers from database", 500);
    }
    return customers;
}

export async function getTopCustomers(): Promise<any[]> {
    const topCustomers = await adminRepository.getTopCustomers();
    if (!topCustomers) {
        throw new AppError("Failed to retrieve top customers from database", 500);
    }
    return topCustomers;
}

// ---------------------------------------------------------------------------
// Shipment service functions (admin-only)
// ---------------------------------------------------------------------------
export async function getShipments(limit?: number, offset?: number): Promise<ShipmentRow[]> {
    return await adminRepository.getAllShipments(limit, offset);
}

export async function updateShipmentStatus(id: string, status: string, updatedBy?: string): Promise<ShipmentRow> {
    const parseResult = updateShipmentStatusSchema.safeParse({ id, status });
    if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]?.message || "Validation error";
        throw new AppError(firstError, 400);
    }

    const updatedShipment = await adminRepository.updateShipmentStatus(
        parseResult.data.id,
        parseResult.data.status,
        updatedBy,
    );

    if (!updatedShipment) {
        throw new AppError("Shipment not found", 404);
    }

    return updatedShipment;
}

export async function getShipmentStatusCounts(): Promise<Record<string, number>> {
    const counts = await shipmentTrackingRepository.getStatusCounts();
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
