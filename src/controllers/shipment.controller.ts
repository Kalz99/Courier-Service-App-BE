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

export async function getShipments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = (req as any).user.id;

        const shipments = await shipmentService.getShipments(userId);

        res.status(200).json({
            message: "Shipments retrieved successfully",
            shipments,
        });
    } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error("Error in get shipments controller:", error);
        res.status(500).json({ message: "An unexpected error occurred during shipment retrieval" });
    }
}

export async function searchShipment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const trackingNumber = req.query.tracking;

        const shipment = await shipmentService.searchShipments(trackingNumber as string);

        if (!shipment) {
            res.status(404).json({ message: "Shipment not found" });
            return;
        }

        res.status(200).json({
            message: "Shipment found successfully",
            shipment,
        });
    } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error("Error in search shipment controller:", error);
        res.status(500).json({ message: "An unexpected error occurred during shipment search" });
    }
}

export async function findByUserId(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = (req as any).user.id;

        if (!userId) {
            res.status(400).json({ message: "A valid user ID is required" });
            return;
        }

        const loggedInUser = req.user;
        if (!loggedInUser) {
            res.status(401).json({ message: "Unauthorized. Authentication is required." });
            return;
        }

        if (loggedInUser.id !== userId && loggedInUser.role !== "customer") {
            res.status(403).json({ message: "Access denied. You are not authorized to view these shipments." });
            return;
        }

        const shipments = await shipmentService.findByUserId(userId);

        res.status(200).json({
            message: "Shipments retrieved successfully",
            shipments,
        });
    } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error("Error in findByUserId controller:", error);
        res.status(500).json({ message: "An unexpected error occurred during shipment retrieval" });
    }
}

export async function updateShipmentStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const shipmentIdParam = req.params.id;

        const shipmentId = Array.isArray(shipmentIdParam) ? shipmentIdParam[0] : shipmentIdParam;

        if (!shipmentId || shipmentId.trim() === "") {
            throw new AppError("A valid shipment ID string is required in the URL path.", 400);
        }

        const { status } = req.body;
        if (!status || typeof status !== "string" || status.trim() === "") {
            throw new AppError("A valid status string is required in the request body.", 400);
        }

        const loggedInUser = req.user;
        if (!loggedInUser) {
            res.status(401).json({ success: false, message: "Unauthorized. Authentication is required." });
            return;
        }
        if (loggedInUser.role !== "admin") {
            res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can update shipment statuses."
            });
            return;
        }

        const updatedShipment = await shipmentService.updateShipmentStatus(shipmentId, status.trim());

        res.status(200).json({
            success: true,
            message: "Shipment status updated successfully",
            data: updatedShipment,
        });

    } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }

        console.error("Error in updateShipmentStatus controller:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred during shipment status update."
        });
    }
}
