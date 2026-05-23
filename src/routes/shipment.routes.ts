import { Router } from "express";
import * as shipmentController from "../controllers/shipment.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    createShipmentBodySchema,
    updateShipmentStatusParamsSchema,
    updateShipmentStatusBodySchema,
    searchShipmentQuerySchema,
} from "../validations/shipment.validation.js";

const router = Router();

router.post(
    "/create-shipment",
    authenticateJWT,
    validate({ body: createShipmentBodySchema }),
    shipmentController.createShipment
);

router.get("/get-shipment", authenticateJWT, shipmentController.getShipments);

router.get(
    "/search-shipment",
    authenticateJWT,
    validate({ query: searchShipmentQuerySchema }),
    shipmentController.searchShipment
);

router.get("/get-my-shipment", authenticateJWT, shipmentController.findByUserId);
router.get("/track-shipment", authenticateJWT, shipmentController.findByTrackingNumber);

router.patch(
    "/update-shipment/:id/status",
    authenticateJWT,
    validate({
        params: updateShipmentStatusParamsSchema,
        body: updateShipmentStatusBodySchema,
    }),
    shipmentController.updateShipmentStatus
);

export default router;


