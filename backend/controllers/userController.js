import User from "../models/User.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async(req,res)=>{
  try {
    
    const {name,email,password} = req.body;

    if(!name||!email||!password){
      return res.status(400).json({
        message:"All fields are required"
      });
    }

    const existingUser = await User.findOne({
      email
    });

    if(existingUser && existingUser.isVerified){
      return res.status(400).json({
        message:"User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password,10);
    
    let user;

    if(existingUser){
      existingUser.name = name;
      existingUser.password = hashedPassword;

      user = await existingUser.save();
    }else{
      user = await User.create({
        name,email,password:hashedPassword,isVerified:false
      });
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();

    const hashedOTP = await bcrypt.hash(otp,10);

    const expiresAt = new Date(
      Date.now() + 5*60*1000 
    );

    await Otp.findOneAndUpdate(
      {email},{
        email,otp:hashedOTP,
        expiresAt,
        attempts:0
      },{
        upsert:true,
        new:true
      }
    );

    await sendEmail(
      email,"BuyOn Email Verification OTP",
      `Your BuyOn verificaton OTP is ${otp}. It will expires in 5 minutes.`,
      `
      <h2>BuyOn Email Verificaton</h2>
      <p>Hello ${name},</p>
      <p>Your verification OTP is :</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you did not create this account, please ignore this email</p>
      
      `
    );

    return res.status(201).json({
      success:true,
      message:"Registration successful. OTP sent to your email.",
      email:email 
    });

  } catch (error) {
    console.log("Registration Erro:",error);
    return res.status(500).json({
      success:false,
      message:"Registration failed"
    });
  }
};

export const verifyOTP = async(req,res)=>{
  try {
    const {email,otp}=req.body;

    if(!email||!otp){
      return res.status(400).json({
        message:"Email and OTP are required"
      });
    }

    const otpRecord = await Otp.findOne({email});
    if(!otpRecord){
      return res.status(400).json({
        message:"OTP expired or not found"
      });
    }
    if(otpRecord.attempts>=5){
      await Otp.deleteOne({email});
      return res.status(429).json({
        message:"Too many incorrect attemps.Please request a new OTP."
      });
    }

    if(otpRecord.expiresAt<new Date()){
      await Otp.deleteOne({email});
      return res.status(400).json({
        message:"OTP has expired"
      });
    }

    const isMatch = await bcrypt.compare(otp,otpRecord.otp);
    if(!isMatch){
      otpRecord.attempts+=1;
      await otpRecord.save();
      
      return res.status(400).json({
        message:"Invalid OTP"
      });
    }

    const user = await User.findOne({email}).select("-password");
    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }

    user.isVerified = true;

    await user.save();

    await Otp.deleteOne({email});

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});

    return res.status(200).json({
      success:true,
      message:"Email verified successfully",
      token,
      user
    });

  } catch (error) {
    console.log("OTP Verification Error :",error);
    return res.status(500).json({
      message:"OTP verification failed"
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(!user.isVerified){
      return res.status(403).json({
        message:"Please verify your email before logging in"
      });
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
      user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        isVerified:user.isVerified
      },
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