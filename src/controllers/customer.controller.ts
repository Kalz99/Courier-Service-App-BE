import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as customerService from "../services/customer.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/errors.js";

export const createShipment = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const shipmentInput = {
        recipientName: req.body.recipientName,
        recipientAddress: req.body.recipientAddress,
        recipientPhoneNumber: req.body.recipientPhoneNumber,
        shipmentType: req.body.shipmentType,
        weight: req.body.weight,
        userId: userId,
    };

    const newShipment = await customerService.create(shipmentInput);

    if (!newShipment) {
        throw new AppError("Failed to create shipment", 500);
    }

    res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        data: newShipment,
    });
});

export const findByUserId = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const shipments = await customerService.findByUserId(userId);

    if (!shipments) {
        throw new AppError("Failed to retrieve shipments", 500);
    }

    res.status(200).json({
        success: true,
        message: "Shipments retrieved successfully",
        data: shipments,
    });
});

export const getMyShipmentStatusCounts = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const counts = await customerService.getMyShipmentStatusCounts(userId);

    if (!counts) {
        throw new AppError("Failed to retrieve status counts", 500);
    }

    res.status(200).json({
        success: true,
        message: "Status counts retrieved successfully",
        data: counts,
    });
});
