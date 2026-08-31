import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async(req,res)=>{
    
    try {
         const {name,description,price,category,brand,stock}=req.body;

         let images=[];
         if(req.files && req.files.length > 0){
            for(const file of req.files){
                const result = await cloudinary.uploader.upload(file.path,{
                    folder:"products", 
                }) ;
                images.push({public_id:result.public_id,url:result.secure_url});
            }
         }

         const product = await Product.create({
            name,description,price,
            category,brand,
            stock,images
         });
         res.status(201).json({
            message:"Product created successfully",product
         });

    } catch (error) {
        res.status(500).json({message:"Error creating product",error:error.message})
    }
   

};

export const getProducts = async(req,res)=>{
    try {
        const products = await Product.find();
        return res.json({
            products
        })
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

export const getProductById = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"product not found"});
        }
        return res.json(product);
    } catch (error) {
        res.status(500).json({message:"Error fetchnig product",error:error.message});
    }
};

export const updateProduct = async(req,res)=>{
    try {
        const {name,description,price,category,brand,stock} = req.body;
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                message:"Prouct not found"
            });
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.stock = stock || product.stock;

        if(req.files && req.files.length > 0){
            for(const img of product.images){
                await cloudinary.v2.uploader.destroy(img.public_id);
            }
            let newImages=[];
            for(const file of req.files){
                const result =  await cloudinary.uploader.upload(file.path,{
                    folder:"products",
                });
                newImages.push({public_id:result.public_id,url:result.secure_url});
            }
            product.images = newImages;
        }
        const updatedProduct = await product.save();
        res.json({message:"Product updated successfully",product:updatedProduct})

    } catch (error) {
        res.status(500).json({
            message:"Error updating product",error:error.message
        })
        
    }
};

export const deleteProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        for(const img of product.images){
            await cloudinary.uploader.destroy(img.public_id);
        }
        await product.deleteOne();
        res.json({message:"Prodcut deleted successfully"});
    } catch (error) {
        res.status(500).json({
            message:"Error deleting product",error:error.message
        })
    }
};