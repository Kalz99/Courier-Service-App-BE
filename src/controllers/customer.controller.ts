import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as customerService from "../services/customer.service.js";
import { catchAsync } from "../utils/catchAsync.js";

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

    res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        data: newShipment,
    });
});

export const findByUserId = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const shipments = await customerService.findByUserId(userId);

    res.status(200).json({
        success: true,
        message: "Shipments retrieved successfully",
        data: shipments,
    });
});
