import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardStatus = async (req,res)=>{
    try {
        const totalProducts = await Product.countDocuments();

        const totalCustomers = await User.countDocuments({role:"user"});

        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate(
            [
                {
                    $match:{orderStatus:{
                        $ne:"CANCELLED" 
                    }}
                },
                {
                    $group:{
                        _id:null,
                        totalRevenue:{
                            $sum:"$totalAmount"
                        }
                    }
                }
            ]
        );
        console.log(revenueResult);
        const totalRevenue = revenueResult.length>0
            ? revenueResult[0].totalRevenue : 0;
        
        return res.status(200).json({
            success:true,
            status:{
                totalProducts,totalCustomers,
                totalOrders,totalRevenue
            }
        });
    } catch (error) {
        
        console.error("Dashboard status Error:",error);

        return res.status(500).json({
            success:false,
            message:"Failed to load dashboard statistics"
        });
    }
};