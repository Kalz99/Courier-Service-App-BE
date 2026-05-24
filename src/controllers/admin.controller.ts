import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as adminService from "../services/admin.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/errors.js";


export const getCustomers = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = page && limit ? (page - 1) * limit : undefined;

    const customers = await adminService.getAllCustomers(limit, offset);

    if (!customers) {
        throw new AppError("Failed to retrieve customers", 500);
    }

    res.status(200).json({
        success: true,
        message: "Customers retrieved successfully",
        data: customers,
    });
});

export const getTopCustomers = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const topCustomers = await adminService.getTopCustomers();

    if (!topCustomers) {
        throw new AppError("Failed to retrieve top customers", 500);
    }

    res.status(200).json({
        success: true,
        message: "Top customers retrieved successfully",
        data: topCustomers,
    });
});


export const getShipments = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const shipments = await adminService.getShipments(limit, offset);

    if (!shipments) {
        throw new AppError("Failed to retrieve shipments", 500);
    }

    res.status(200).json({
        success: true,
        message: "Shipments retrieved successfully",
        data: shipments,
    });
});

export const updateShipmentStatus = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const loggedInUser = req.user!;

    const shipmentId = req.params.id as string;
    const { status } = req.body;

    const updatedShipment = await adminService.updateShipmentStatus(shipmentId, status, loggedInUser.id);

    res.status(200).json({
        success: true,
        message: "Shipment status updated successfully",
        data: updatedShipment,
    });
});

export const getShipmentStatusCounts = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const counts = await adminService.getShipmentStatusCounts();

    if (!counts) {
        throw new AppError("Failed to retrieve status counts", 500);
    }

    res.status(200).json({
        success: true,
        message: "Status counts retrieved successfully",
        data: counts,
    });
});
