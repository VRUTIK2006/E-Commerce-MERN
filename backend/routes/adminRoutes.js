import express from "express";
import { getDashboardStatus } from "../controllers/adminController.js";
import {protect,admin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard",protect,admin,getDashboardStatus);

export default router;
