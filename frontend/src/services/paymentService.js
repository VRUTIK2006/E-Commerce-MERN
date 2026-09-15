import api from "../services/api.js";

export const createPaymentAPI = async(orderId)=>{
    const response = await api.post("/payment/create",{
        orderId,
    });

    return response.data;
};

export const verifyPaymentAPI = async(paymentData)=>{
    const response = await api.post("/payment/verify",paymentData);

    return response.data;
};

