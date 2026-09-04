import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    otp: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true,
    },

    attempts: {
        type: Number,
        default: 0
    }
});

otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export default mongoose.model("Otp", otpSchema);