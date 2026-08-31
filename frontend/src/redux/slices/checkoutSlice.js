import { createSlice } from "@reduxjs/toolkit";

const savedAddress = localStorage.getItem("shippingAddress");
const savedPaymentMethod = localStorage.getItem("paymentMethod");

const initialState = {
    shippingAddress: savedAddress
        ? JSON.parse(savedAddress)
        : {
              fullName: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              postalCode: "",
          },

    paymentMethod: savedPaymentMethod || "",
};

const checkoutSlice = createSlice({
    name:"checkout",
    initialState,
    reducers:{
        saveShippingAddress:(state,action)=>{
            state.shippingAddress = action.payload;

            localStorage.setItem(
                "shippingAddress",
                JSON.stringify(action.payload)
            );
        
        },
        setPaymentMethod:(state,action)=>{
            state.paymentMethod = action.payload;

            localStorage.setItem(
                "paymentMethod",
                action.payload
            );
        },

        clearCheckout:(state)=>{
            state.shippingAddress={
                fullName:"",
                phone:"",
                address:"",
                city:"",
                state:"",
                postalCode:"",
            };
            state.paymentMethod = "";

            localStorage.removeItem("shippingAddress");
            localStorage.removeItem("paymentMethod");
        },

    },
});

export const {
    saveShippingAddress,setPaymentMethod,clearCheckout
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
