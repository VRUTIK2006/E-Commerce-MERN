import mongoose from "mongoose";

const connectDB = async (req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected...");
    } catch (error) {
        res.status(500).send("Error in Mongodb Connection.");
    }
    
}

export default connectDB;