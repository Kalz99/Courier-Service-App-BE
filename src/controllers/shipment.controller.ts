import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as shipmentService from "../services/shipment.service.js";
import { AppError } from "../utils/errors.js";
import { catchAsync } from "../utils/catchAsync.js";



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
});
