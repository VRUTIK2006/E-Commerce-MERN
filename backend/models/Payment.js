import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true,
        unique:true 
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true 
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        default:"INR"
    },
    method:{
        type:String,
        enum:["COD","RAZORPAY"],
        required:true
    },
    status:{
        type:String,
        enum:["PENDING","PROCESSING","SUCCESS","FAILED","REFUNDED","PARTIALLY_REFUNDED"],
        default:"PENDING"
    },
    razorpayOrderId: {
            type: String,
            default: null
        },

        razorpayPaymentId: {
            type: String,
            default: null
        },

        razorpaySignature: {
            type: String,
            default: null
        },

        failureReason: {
            type: String,
            default: null
        },

        refundAmount: {
            type: Number,
            default: 0
        },

        refundId: {
            type: String,
            default: null
        },

        paidAt: {
            type: Date,
            default: null
        },

        refundedAt: {
            type: Date,
            default: null
        }
},{timestamps: true});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;