import { Router } from "express";
import * as customerController from "../controllers/customer.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/get-customers", authenticateJWT, customerController.getCustomers);
router.get("/get-top-customers", authenticateJWT, customerController.getTopCustomers);

export default router;