import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        
    }
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Not authorized, no token"
        });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User no longer exists"
            });
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Token invalid or expired"});
        
    }

};

export const admin = (req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
    }
    else{
        return res.status(403).json({
            success:false,
            message:"Access Denaid : Admin Only"});            
    }
}