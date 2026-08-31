import express from "express";

import { createPayment,verifyPayment,getMyPayments,
    getPaymentByOrder,getAllPayments,getPaymentById,refundPayment
 } from "../controllers/paymentCotrollers.js";

import {protect,admin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create",protect,createPayment);
router.post("/verify",protect,verifyPayment);
router.get("/my-payments",protect,getMyPayments);
router.get("/order/:orderId",protect,getPaymentByOrder);

router.get("/admin/all",protect,admin,getAllPayments);
router.get("/admin/:id",protect,admin,getPaymentById);
router.post("/admin/:id/refund",protect,admin,refundPayment);

export default router;