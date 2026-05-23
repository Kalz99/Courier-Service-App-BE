import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticateJWT, requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    updateShipmentStatusParamsSchema,
    updateShipmentStatusBodySchema,
} from "../validations/shipment.validation.js";

const router = Router();

router.get("/get-customers", authenticateJWT, requireAdmin, adminController.getCustomers);
router.get("/get-top-customers", authenticateJWT, requireAdmin, adminController.getTopCustomers);

router.get("/get-shipment", authenticateJWT, requireAdmin, adminController.getShipments);
router.get("/get-status-counts", authenticateJWT, requireAdmin, adminController.getShipmentStatusCounts);
router.patch("/update-shipment/:id/status", authenticateJWT, requireAdmin, validate({ params: updateShipmentStatusParamsSchema, body: updateShipmentStatusBodySchema, }), adminController.updateShipmentStatus);

export default router;
