import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { clearCheckout } from "../../redux/slices/checkoutSlice";
import { useState,useEffect } from "react";
import api from "../../services/api";

import { placeOrderAPI } from "../../services/orderService";


export default function ReviewOrder() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [orderPlaced, setOrderPlaced] = useState(false);    const[loading,setLoading] = useState(false);
    const[error,setError] = useState("");
    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const shippingAddress = useSelector(
        (state) => state.checkout.shippingAddress
    );

    const paymentMethod = useSelector(
        (state) => state.checkout.paymentMethod
    );

    const subtotal = cartItems.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 100 : 0;

    const total = subtotal + shipping;

    useEffect(() => {
    if (!orderPlaced && !shippingAddress.fullName) {
        navigate("/checkout");
    }
    }, [shippingAddress, navigate, orderPlaced]);

    useEffect(() => {
    if (!orderPlaced && !paymentMethod) {
    navigate("/payment");
    }
    }, [paymentMethod, navigate, orderPlaced]);

    const handlePlaceOrder = async()=>{
        try {
            setLoading(true);
            setError("");

            const orderData = {
                items:cartItems.map((item)=>({
                    product:item.product._id,
                    quantity:item.quantity,
                })),
                shippingAddress,
                paymentMethod,
            };

            const response = await placeOrderAPI(orderData);

            console.log("Order Created : ",response);
            await api.delete("/cart");

            dispatch(clearCart());
            dispatch(clearCheckout());
            setOrderPlaced(true);
            
            navigate("/order-success",{
                state:{
                    order:response.order, 
                },
            });
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||  "Failed to place order"
            );
            
        }finally{
        setLoading(false);
    };
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">
                Review Your Order
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT */}

                <div className="lg:col-span-2 space-y-6">

                    {/* ADDRESS */}

                    <div className="bg-white shadow-md rounded-xl p-6">

                        <div className="flex justify-between items-center mb-4">

                            <h2 className="text-xl font-bold">
                                Delivery Address
                            </h2>

                            <button
                                onClick={() =>
                                    navigate("/checkout")
                                }
                                className="text-green-600 font-semibold"
                            >
                                Change
                            </button>

                        </div>

                        <div className="text-gray-700 space-y-1">

                            <p className="font-semibold">
                                {shippingAddress.fullName}
                            </p>

                            <p>
                                {shippingAddress.phone}
                            </p>

                            <p>
                                {shippingAddress.address}
                            </p>

                            <p>
                                {shippingAddress.city},{" "}
                                {shippingAddress.state} -{" "}
                                {shippingAddress.postalCode}
                            </p>

                        </div>

                    </div>


                    {/* PRODUCTS */}

                    <div className="bg-white shadow-md rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-5">
                            Order Items
                        </h2>

                        <div className="space-y-5">

                            {cartItems.map((item) => (

                                <div
                                    key={item._id}
                                    className="flex items-center gap-4"
                                >

                                    <img
                                        src={item.product.images?.[0].url}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />

                                    <div className="flex-1">

                                        <h3 className="font-semibold">
                                            {item.product.name}
                                        </h3>

                                        <p className="text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>

                                    </div>

                                    <p className="font-semibold">
                                        ₹{item.product.price * item.quantity}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* PAYMENT */}

                    <div className="bg-white shadow-md rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-4">
                            Payment Method
                        </h2>

                        {paymentMethod === "COD" ? (

                            <div>

                                <h3 className="font-semibold">
                                    Cash on Delivery
                                </h3>

                                <p className="text-gray-500">
                                    Pay when your order is delivered.
                                </p>

                            </div>

                        ) : (

                            <div>

                                <h3 className="font-semibold">
                                    Razorpay
                                </h3>

                                <p className="text-gray-500">
                                    Online payment
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* SUMMARY */}

                <div className="bg-gray-100 rounded-xl p-6 h-fit">

                    <h2 className="text-xl font-bold mb-5">
                        Price Details
                    </h2>

                    <div className="flex justify-between mb-3">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between mb-3">
                        <span>Shipping</span>
                        <span>₹{shipping}</span>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                            disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-green-700 disabled:bg-gray-400"
                        >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>

                </div>

            </div>

        </div>
    );
}