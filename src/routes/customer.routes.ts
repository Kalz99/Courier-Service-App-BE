import { Router } from "express";
import * as customerController from "../controllers/customer.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createShipmentBodySchema } from "../validations/shipment.validation.js";

const router = Router();

router.post("/create-shipment", authenticateJWT, validate({ body: createShipmentBodySchema }), customerController.createShipment);
router.get("/get-my-shipment", authenticateJWT, customerController.findByUserId);
router.get("/get-my-status-counts", authenticateJWT, customerController.getMyShipmentStatusCounts);

export default router;
