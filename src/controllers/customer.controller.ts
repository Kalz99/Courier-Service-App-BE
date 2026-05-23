import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import * as customerService from "../services/customer.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/errors.js";

export const getCustomers = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const loggedInUser = req.user!;
    if (loggedInUser.role !== "admin") {
        throw new AppError("Access denied. Only administrators can view customer directory.", 403);
    }

    const customers = await customerService.getAllCustomers();
    
    res.status(200).json({
        success: true,
        message: "Customers retrieved successfully",
        data: customers,
    });
});
