import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req,res)=>{
   try {
    const {name,email,password} = req.body;
   const user = await User.findOne({email});
   if(user){
    return res.send("User Already Exists...");
   }
   const salt = await bcrypt.genSalt(10);
   
   const hashedPassword = await bcrypt.hash(password,salt);
   const newuser = await User.create({
        name,email,password:hashedPassword
    });
   const token = jwt.sign({id:newuser._id},process.env.JWT_SECRET,{expiresIn:"1h"});


    return res.status(201).json({
        message:"Successfull",
        newuser,
        token
    });

   } catch (error) {
     return res.status(500).send("Registration Error");
   }
   

};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const allUsers = async(req,res)=>{
    const users = await User.find().select("name");
    return res.json({
        users
    })
};