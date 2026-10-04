import express from "express";
import {protect,admin} from "../middlewares/authMiddleware.js"

const router = express.Router();

import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderControllers.js";


// Customer
router.post("/", protect, createOrder);

router.get(
    "/my-orders",
    protect,
    getMyOrders
);

router.get(
    "/:id",
    protect,
    getOrderById
);

router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);

// Admin
router.get(
    "/admin/all",
    protect,
    admin,
    getAllOrders
);

router.put(
    "/admin/:id/status",
    protect,
    admin,
    updateOrderStatus
);

export default router;