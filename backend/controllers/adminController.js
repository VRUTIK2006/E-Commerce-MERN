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

export const getAllCustomers = async(req,res)=>{
    try {
        const {search=""} = req.query;
        const query = {
            role:"user",
            $or:[
                {name:{$regex:search,$options:"i"}},
                {email:{$regex:search,$options:"i"}}
            ]
        };

        const customers = await User.find(query)
        .select("-password")
        .sort({createdAt:-1});

        return res.json({
            success:true,
            customers
        });
    } catch (error) {
        console.error("Get Customer Error :",error);

        return res.status(500).json({
            success:false,
            message:"Error fetching customers",
            error:error.message
        });
    }
};

export const getCustomerDetails = async(req,res)=>{
    try {
        const customer = await User.findOne({
            _id:req.params.id,
            role:"user"  
        }).select("-password");

        console.log("Customer ..",customer)

        if(!customer){
            return res.status(400).json({
                success:false,
                message:"Customer not found"
            });
        }

        const orders = await Order.find({
            user: customer._id   
        }).sort({createdAt:-1});

        console.log("Orders...:",orders);

        const totalOrders = orders.length;

        const totalSpent = orders.filter(order=>order.orderStatus !="CANCELLED").reduce((total,order)=>total+order.totalAmount,0);
        return res.json({
            success:true,
            customer,orders,totalOrders,totalSpent
        });
    } catch (error) {
        console.error("Get Customer Details Error:",error);

        return res.status(500).json({
            success:false,
            message:"Error fetching customer details",
            error:error.message
        });
    }
};
