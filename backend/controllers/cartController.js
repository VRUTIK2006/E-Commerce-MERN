import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async(req,res)=>{
    try {
        const cart = await Cart.findOne({
            user:req.user._id
        }).populate("items.product");

        if(!cart){
            return res.status(200).json({
                success:true,
                cart:[]
            });
        }
        res.status(200).json({
            success:true,
            cart:cart.items
        });
    } catch (error) {
        console.error(error);
        console.log(req.user);
        res.status(500).json({
            success:false,
            message:"Failed to get cart"
        });
    }
};

export const addToCart = async(req,res)=>{
    try {
        const {productId} = req.body;
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }

        let cart = await Cart.findOne({
            user:req.user._id 
        });

        if(!cart){
            cart = await Cart.create({
                user:req.user._id,
                items:[
                    {
                        product:productId,
                        quantity:1
                    }
                ]
            });
        }else{
            const existingItem = cart.items.find(
                item=>item.product.toString() === productId 
            );

            if(existingItem){
                existingItem.quantity += 1;

            }else{
                cart.items.push({
                    product:productId,
                    quantity:1
                });
            }

            await cart.save();
        }
        const updatedCart = await Cart.findOne({
            user:req.user._id 
        }).populate("items.product");

        res.status(200).json({
            success:true,
            cart:updatedCart.items
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to add to cart"
        });
    }
};

export const updateCartQuantity = async(req,res)=>{
    try {
        const {productId} = req.params;
        const {quantity} = req.body;

        const cart = await Cart.findOne({
            user:req.user._id 
        });
        
        if(!cart){
            return res.status(404).json({
                message:"Cart not found"
            });
        }

        const item = cart.items.find(
            item=>item.product.toString() === productId 
        );

        if(!item){
            return res.status(404).json({
                message:"Product not found in cart"
            });
        };

        if(quantity <= 0){
            cart.item = cart.items.filter(
                item=>item.product.toString() !== productId 
            );
        }else{
            item.quantity = quantity;
        }

        await cart.save();

        const updatedCart = await Cart.findOne({
            user:req.user._id 
        }).populate("items.product");

        res.status(200).json({
            success:true,
            cart:updatedCart.items
        });


    } catch (error) {
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to update cart"
        });
    }
};

export const removeFromCart = async (req, res) => {

    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item =>
                item.product.toString() !== productId
        );

        await cart.save();

        const updatedCart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        res.status(200).json({
            success: true,
            cart: updatedCart.items
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to remove item"
        });
    }
};

export const clearCart = async (req,res)=>{
    try {
        await Cart.deleteMany({user:req.user._id});
        res.json({success:true,message:"Cart cleared"});
    } catch (error) {
        res.status(500).json({message:"Error clearing cart",error:error.message});
    }
};