import express from "express";
import { getDashboardStatus,getAllCustomers, getCustomerDetails } from "../controllers/adminController.js";
import {protect,admin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard",protect,admin,getDashboardStatus);
router.get("/customers",protect,admin,getAllCustomers);
router.get("/customers/:id",getCustomerDetails);

export default router;
