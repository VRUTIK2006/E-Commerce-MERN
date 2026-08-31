import mongoose from "mongoose";

const orderItemScema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true 
    },
    name:{
        type:String,
        required:true 
    },
    image:{
        type:String 
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    subtotal:{
        type:Number,
        required:true
    }
    
},{_id:false});

const orderSchmea = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true 
    },
    items:{
        type:[orderItemScema],
        required:true,
        validate:{
            validator:function (items){
                return items.length > 0;
            },
            message:"Order must contain at least on item"
        }
    },
    shippingAddress:{
        fullName:{
            type:String,
            required:true 
        },
        phone:{
            type:String,
            required:true 
        },
        address:{
            type:String,
            required:true 
        },
        city:{
            type:String,
            required:true 
        },
        state:{
            type:String,
            required:true
        },
        postalCode:{
            type:String,
            required:true 
        },
        country:{
            type:String,
            default:"India"
        }
    },
    subtotal:{
        type:Number,
        required:true 
    },
    shippigFee:{
        type:Number,
        default:0
    },
    tax:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        required:true 
    },
    paymentMethod:{
        type:String,
        enum:["COD","RAZORPAY","STRIPE"],
        default:"COD" 
    },
    paymentStatus:{
        type:String,
        enum:["PENDING","PAID","FAILED","REFUNDED"],
        default:"PENDING"
    },
    transactionId:{
        type:String,
        default:null 
    },
    paidAt:{
        type:Date,
        default:null 
    },
    orderStatus:{
        type:String,
        enum:["PLACED","CONFIRMED","PROCESSING","SHIPPED","OUT_FOR_DELIVERY","CANCELLED","DELIVERED"],
        default:"PLACED"
    },
    trackingNumber:{
        type:String,
        default:null
    },
    cancellationReason:{
        type:String,
        default:null
    },
    cancelledAt:{
        type:Date,
        default:null
    },
    deliveredAt:{
        type:Date,
        default:null
    }

},{timestamps:true});

const Order = mongoose.model("Order",orderSchmea);

export default Order;