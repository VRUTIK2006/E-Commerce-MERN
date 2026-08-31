import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item"
            });
        }

        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const itemSubtotal =
                product.price * item.quantity;

            subtotal += itemSubtotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images?.[0]?.url || "",
                price: product.price,
                quantity: item.quantity,
                subtotal: itemSubtotal
            });
        }

        const shippingFee = subtotal >= 1000 ? 0 : 50;

        const tax = subtotal * 0.18;

        const discount = 0;

        const totalAmount =
            subtotal +
            shippingFee +
            tax -
            discount;

        const order = await Order.create({
            user: req.user._id,

            items: orderItems,

            shippingAddress,

            subtotal,
            shippingFee,
            tax,
            discount,
            totalAmount,

            paymentMethod
        });

        // Reduce stock
        for (const item of items) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user._id
        })
        .populate("items.product", "name");

        return res.json({
            success: true,
            orders
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.product", "name");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.json({
            success: true,
            order
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching order",
            error: error.message
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            !["PLACED", "CONFIRMED"].includes(
                order.orderStatus
            )
        ) {
            return res.status(400).json({
                message: "Order cannot be cancelled now"
            });
        }

        order.orderStatus = "CANCELLED";

        order.cancellationReason =
            req.body.reason || "Cancelled by customer";

        order.cancelledAt = new Date();

        await order.save();

        // Restore stock
        for (const item of order.items) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        return res.json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error cancelling order",
            error: error.message
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatuses = [
            "PLACED",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus = status;

        if (status === "DELIVERED") {
            order.deliveredAt = new Date();
        }

        await order.save();

        return res.json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};

