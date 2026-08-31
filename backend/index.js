import "dotenv/config";

import express from "express";
import cors from "cors";
import conntecDB  from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

conntecDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/api/user',userRoutes);
app.use('/api/product',productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/cart",cartRoutes);

app.get('/',(req,res)=>{
    res.send('Hello form Home');
});


app.listen(PORT,()=>{
    console.log("Server Started....");
})