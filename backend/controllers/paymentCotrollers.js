import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import crypto from "crypto";

export const createPayment = async(req,res)=>{
    try {
        const {orderId} = req.body;
        if(!orderId){
            return res.status(400).json({
                success:false,
                message:"Order ID is required"
            });
        }

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            });
        }

        if(order.user.toString()!==req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to pay for this order"
            });
        }
        if(order.paymentStatus === "PAID"){
            return res.status(400).json({
                success:false,
                messsage:"Order is already paid"
            });
        }
        if(order.paymentMethod === "COD"){
            const existingPayment = await Payment.findOne({
                order:order._id
            });
            if(existingPayment){
                return res.status(400).json({
                    success:false,
                    message:"Payment already exists for this order"
                });
            }

            const payment = await Payment.create({
                order:order._id,
                user:req.user._id,
                amount:order.totalAmount,
                currency:"INR",
                method:"COD",
                status:"PENDING"
            });
            return res.status(201).json({
                sucess:true,
                message:"COD payment created",
                payment
            });
        }

        if(order.paymentMethod==="RAZORPAY"){
            let payment = await Payment.findOne({
                order:order._id
            });

            if(payment && payment.razorpayOrderId){
                return res.status(200).json({
                    success:true,
                    message:"Payment already initialized",
                    razorpayOrderId:payment.razorpayOrderId,
                    amount:payment.amount,
                    currency:payment.currency,
                    key:process.env.RAZORPAY_KEY_ID
                });
            }
            const amountInPaise = Math.round(order.totalAmount * 100);
            const razorpayOrder = await razorpay.orders.create({
                amount:amountInPaise,
                currency:"INR",
                receipt:`order_${order._id}`,
                notes:{
                    orderId:order._id.toString(),
                    userId:req.user._id.toString()
                }
            });

            payment = await Payment.create({
                order:order._id,
                user:req.user._id,
                amount:order.totalAmount,
                currency:"INR",
                method:"RAZORPAY",
                status:"PENDING",
                razorpayOrderId:razorpayOrder.id 
            });

            return res.status(201).json({
                success:true,
                message:"Razorpay payment initialized",
                paymentId:payment._id,
                razorpayOrderId:razorpayOrder.id
            });

            return res.status(201).json({
                success:true,
                message:"Razorpay payment initailiezed",
                paymentId:payment._id,
                razorpayOrderId:razorpayOrder.id,
                amount:razorpayOrder.amount,
                currency:razorpayOrder.currency,
                key:process.env.RAZORPAY_KEY_ID
            });
        }
        return res.status(400).josn({
            sucess:false,
            message:"Unsupported payment method"
        });
    } catch (error) {
        console.log("Create Payment Erro:"),
        error

        return res.status(500).json({
            success:false,
            message:"Error creating payment",
            error:error.message
        });
    }
};

export const verifyPayment = async(req,res)=>{
    try {
        const{razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature
        } = req.body;
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return res.status(400).json({
                success:false,
                message:"Payment verification data is incomplete"
            });
        }

        const payment = await Payment.findOne({
            razorpayOrderId:razorpay_order_id 
        });
        if(!payment){
            return res.status(404).json({
                success:false,
                message:"Payment record not found"
            });
        }

        if(payment.user.toString()!==req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"You are not authorized"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(razorpay_signature)
        );
        if(!isValid){
            payment.status = "FAILED";
            payment.failureReason="Invalid payment signature";

            await payment.save();

            return res.status(400).json({
                success:false,
                message:"Invaldi payment signature"
            });
            
        }

        payment.status="SUCCESS";
        payment.razorpayPaymentId=razorpay_payment_id;
        payment.razorpaySignature=razorpay_signature;

        payment.paidAt = new Date();

        await payment.save();

        const order = await Order.findById(payment.order);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            });
        }

        order.paymentStatus = "PAID";
        order.orderStatus = "CONFIRMED";
        order.transactionId = razorpay_payment_id;
        order.paidAt = new Date();

        await order.save();

        return res.status(200).json({
            sucess:true,
            message:"Payment verified successfully",
            payment,
            order 
        });
    } catch (error) {
        console.error(
            "Verify Pyment Error:",error
        );

        return res.status(500).json({
            success:false,
            message:"Error verifying payment",
            error:error.message
        });
        
    }
};

export const getMyPayments = async (
    req,
    res
) => {

    try {

        const payments =
            await Payment.find({
                user: req.user._id
            })
            .populate(
                "order",
                "totalAmount orderStatus createdAt"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count:
                payments.length,

            payments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Error fetching payments",

            error:
                error.message

        });
    }
};


export const getPaymentByOrder = async (
    req,
    res
) => {

    try {

        const { orderId } =
            req.params;


        const order =
            await Order.findById(orderId);


        if (!order) {

            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }

        if (
            order.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized"
            });
        }


        const payment =
            await Payment.findOne({
                order: orderId
            });


        if (!payment) {

            return res.status(404).json({
                success: false,
                message:
                    "Payment not found"
            });
        }


        return res.status(200).json({

            success: true,

            payment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Error fetching payment",

            error:
                error.message

        });
    }
};

export const getAllPayments = async (
    req,
    res
) => {

    try {

        const payments =
            await Payment.find()

            .populate(
                "user",
                "name email"
            )

            .populate(
                "order",
                "totalAmount orderStatus createdAt"
            )

            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count:
                payments.length,

            payments

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Error fetching all payments",

            error:
                error.message

        });
    }
};


export const getPaymentById = async (
    req,
    res
) => {

    try {

        const payment =
            await Payment.findById(
                req.params.id
            )

            .populate(
                "user",
                "name email"
            )

            .populate(
                "order"
            );


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment not found"

            });
        }


        return res.status(200).json({

            success: true,

            payment

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                "Error fetching payment",

            error:
                error.message

        });
    }
};

export const refundPayment = async (
    req,
    res
) => {

    try {

        const { amount } =
            req.body;


        const payment =
            await Payment.findById(
                req.params.id
            );


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment not found"

            });
        }


        if (
            payment.status !== "SUCCESS"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only successful payments can be refunded"

            });
        }

        if (
            payment.method === "COD"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "COD refund must be handled separately"

            });
        }


        const refundAmount =
            amount ||
            payment.amount;


        if (
            refundAmount <= 0 ||
            refundAmount > payment.amount
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid refund amount"

            });
        }

        const refund =
            await razorpay.payments.refund(

                payment.razorpayPaymentId,

                {
                    amount:
                        Math.round(
                            refundAmount * 100
                        )
                }

            );


        payment.refundAmount =
            (payment.refundAmount || 0) +
            refundAmount;

            payment.refundId =
            refund.id;


        if (
            payment.refundAmount >=
            payment.amount
        ) {

            payment.status =
                "REFUNDED";

            payment.refundedAt =
                new Date();

        } else {

            payment.status =
                "PARTIALLY_REFUNDED";
        }


        await payment.save();

        const order =
            await Order.findById(
                payment.order
            );


        if (
            order &&
            payment.status === "REFUNDED"
        ) {

            order.paymentStatus =
                "REFUNDED";

            await order.save();
        }


        return res.status(200).json({

            success: true,

            message:
                "Refund processed successfully",

            refund,

            payment

        });


    } catch (error) {

        console.error(
            "Refund Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Error processing refund",

            error:
                error.message

        });
    }
};