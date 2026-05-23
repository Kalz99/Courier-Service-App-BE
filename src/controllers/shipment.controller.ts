import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as shipmentService from "../services/shipment.service.js";
import { AppError } from "../utils/errors.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createShipment = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const shipmentInput = {
        recipientName: req.body.recipientName,
        recipientAddress: req.body.recipientAddress,
        recipientPhoneNumber: req.body.recipientPhoneNumber,
        shipmentType: req.body.shipmentType,
        weight: req.body.weight,
        userId: userId
    };

    const newShipment = await shipmentService.create(shipmentInput);

    res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        data: newShipment,
    });
});

export const getShipments = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const shipments = await shipmentService.getShipments(userId);

    res.status(200).json({
        success: true,
        message: "Shipments retrieved successfully",
        data: shipments,
    });
});

export const searchShipment = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const trackingNumber = req.query.tracking as string;

    const shipment = await shipmentService.searchShipments(trackingNumber);

    if (!shipment) {
        throw new AppError("Shipment not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Shipment details retrieved successfully",
        data: shipment,
    });
});

export const findByUserId = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const shipments = await shipmentService.findByUserId(userId);

    res.status(200).json({
        success: true,
        message: "Shipments retrieved successfully",
        data: shipments,
    });
});

export const updateShipmentStatus = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const shipmentId = req.params.id as string;
    const { status } = req.body;

    const loggedInUser = req.user!;

    if (loggedInUser.role !== "admin") {
        throw new AppError("Access denied. Only administrators can update shipment status.", 403);
    }

    const updatedShipment = await shipmentService.updateShipmentStatus(shipmentId, status);

    res.status(200).json({
        success: true,
        message: "Shipment status updated successfully",
        data: updatedShipment,
    });
});

export const findByTrackingNumber = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const tracking = req.query.tracking as string;
    if (!tracking) {
        throw new AppError("Tracking number is required", 400);
    }
    const result = await shipmentService.trackShipment(tracking);
    res.status(200).json({
        success: true,
        message: "Shipment tracking details retrieved successfully",
        data: result,
    });
})



