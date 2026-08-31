import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true 
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0 
    },
    category:{
        type:String,
        requird:true
    },
    brand:{
        type:String,
        default:"Generic"
    },
    stock:{
        type:Number,
        requird:true,
        min:0,
        default:0
    },
    images:[
        {
            public_id:{type:String},
            url:{type:String},
        }
    ],
    ratings:{
        type:Number,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            name:{type:String,required:true},
            rating:{type:Number,required:true},
            comment:{type:String}
        }
    ]
},{timestamps:true});

export default mongoose.model("Product",productSchema);
