import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as shipmentService from "../services/shipment.service.js";
import { AppError } from "../utils/errors.js";

export async function createShipment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = (req as any).user.id;

        const shipmentInput = {
            recipientName: req.body.recipientName,
            recipientAddress: req.body.recipientAddress,
            recipientPhoneNumber: req.body.recipientPhoneNumber,
            shipmentType: req.body.shipmentType,
            weight: Number(req.body.weight),
            userId: userId
        };


        const newShipment = await shipmentService.create(shipmentInput);

        res.status(201).json({
            message: "Shipment created successfully",
            shipment: newShipment,
        });
    } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error("Error in create shipment controller:", error);
        res.status(500).json({ message: "An unexpected error occurred during shipment creation" });
    }
}
