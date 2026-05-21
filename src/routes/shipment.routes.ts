import { Router } from "express";
import * as shipmentController from "../controllers/shipment.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-shipment", authenticateJWT, shipmentController.createShipment);
router.get("/get-shipment", authenticateJWT, shipmentController.getShipments);
router.get("/search-shipment", shipmentController.searchShipment);

export default router;
