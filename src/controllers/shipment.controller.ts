import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as shipmentService from "../services/shipment.service.js";
import { AppError } from "../utils/errors.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createShipment = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = (req as any).user.id;

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
        message: "Shipment created successfully",
        shipment: newShipment,
    });
});

export const getShipments = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = (req as any).user.id;

    const shipments = await shipmentService.getShipments(userId);

    res.status(200).json({
        message: "Shipments retrieved successfully",
        shipments,
    });
});

export const searchShipment = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const trackingNumber = req.query.tracking as string;

    const shipment = await shipmentService.searchShipments(trackingNumber);

    if (!shipment) {
        throw new AppError("Shipment not found", 404);
    }

    res.status(200).json({
        message: "Shipment found successfully",
        shipment,
    });
});

export const findByUserId = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = (req as any).user.id;

    if (!userId) {
        throw new AppError("A valid user ID is required", 400);
    }

    const loggedInUser = req.user;
    if (!loggedInUser) {
        throw new AppError("Unauthorized. Authentication is required.", 401);
    }

    if (loggedInUser.id !== userId && loggedInUser.role !== "customer") {
        throw new AppError("Access denied. You are not authorized to view these shipments.", 403);
    }

    const shipments = await shipmentService.findByUserId(userId);

    res.status(200).json({
        message: "Shipments retrieved successfully",
        shipments,
    });
});

export const updateShipmentStatus = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const shipmentId = req.params.id as string;
    const { status } = req.body;

    const loggedInUser = req.user;
    if (!loggedInUser) {
        throw new AppError("Unauthorized. Authentication is required.", 401);
    }
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
