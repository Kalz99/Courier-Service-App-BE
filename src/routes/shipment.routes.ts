import { Router } from "express";
import * as shipmentController from "../controllers/shipment.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { searchShipmentQuerySchema } from "../validations/shipment.validation.js";

const router = Router();

router.get("/search-shipment", authenticateJWT, validate({ query: searchShipmentQuerySchema }), shipmentController.searchShipment);

router.get("/track-shipment", shipmentController.findByTrackingNumber);

export default router;
