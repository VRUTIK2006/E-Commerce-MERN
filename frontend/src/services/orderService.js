import api from "./api.js";

export const placeOrderAPI = async(orderData)=>{
    const response = await api.post("/order",orderData);
    console.log(response.data);
    return response.data;
};

export const getMyOrdersAPI = async()=>{
    const response = await api.get("order/my-orders");
    return response.data;
};

export const getOrderByIdAPI = async(orderId)=>{
    const response = await api.get(`order/${orderId}`);
    return response.data;
};