import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { clearCart } from "../../redux/slices/cartSlice";
import { clearCheckout } from "../../redux/slices/checkoutSlice";

import api from "../../services/api";
import { placeOrderAPI } from "../../services/orderService";
import {
    createPaymentAPI,
    verifyPaymentAPI,
} from "../../services/paymentService";

export default function ReviewOrder() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    /*
        IMPORTANT:
        These are currently only for displaying the review page.

        Your backend is the final source of truth for:
        shipping + tax + total.
    */

    const shipping = subtotal >= 1000 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;


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


    // Load Razorpay checkout script
    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };


    const clearOrderData = async () => {

        try {
            await api.delete("/cart");
        } catch (error) {
            console.error(
                "Failed to clear backend cart:",
                error
            );
        }

        dispatch(clearCart());
        dispatch(clearCheckout());
    };


    const handleCODOrder = async (orderData) => {

        const response = await placeOrderAPI(orderData);

        console.log("COD Order Created:", response);

        await clearOrderData();

        setOrderPlaced(true);

        navigate("/order-success", {
            state: {
                order: response.order,
            },
        });
    };


    const handleRazorpayOrder = async (orderData) => {

        // 1. Create order in our database
        const response = await placeOrderAPI(orderData);

        const order = response.order;

        console.log("Order Created:", order);


        // 2. Load Razorpay checkout
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {

            setError(
                "Razorpay failed to load. Please check your internet connection and try again."
            );

            return;
        }


        // 3. Create Razorpay payment/order
        const paymentResponse =
            await createPaymentAPI(order._id);

        console.log(
            "Razorpay Payment Created:",
            paymentResponse
        );


        // 4. Razorpay popup options
        const options = {

            key: paymentResponse.key,

            amount: paymentResponse.amount,

            currency: paymentResponse.currency,

            name: "BuyOn",

            description: `Payment for Order #${order._id}`,

            order_id:
                paymentResponse.razorpayOrderId,

            handler: async function (paymentResult) {

                try {

                    setLoading(true);
                    setError("");

                    console.log(
                        "Razorpay Payment Result:",
                        paymentResult
                    );


                    // 5. Verify payment on backend
                    const verifyResponse =
                        await verifyPaymentAPI({

                            razorpay_order_id:
                                paymentResult.razorpay_order_id,

                            razorpay_payment_id:
                                paymentResult.razorpay_payment_id,

                            razorpay_signature:
                                paymentResult.razorpay_signature,

                        });


                    console.log(
                        "Payment Verified:",
                        verifyResponse
                    );


                    // 6. Payment successful
                    await clearOrderData();

                    setOrderPlaced(true);

                    navigate("/order-success", {

                        state: {
                            order: verifyResponse.order,
                        },

                    });

                } catch (error) {

                    console.error(
                        "Payment verification error:",
                        error
                    );

                    setError(
                        error.response?.data?.message ||
                        "Payment verification failed."
                    );

                } finally {

                    setLoading(false);

                }
            },


            prefill: {

                name: shippingAddress.fullName,

                contact: shippingAddress.phone,

            },


            notes: {

                orderId: order._id,

            },


            theme: {

                color: "#16a34a",

            },

        };


        // 7. Open Razorpay popup
        const razorpay = new window.Razorpay(options);

        razorpay.on(
            "payment.failed",
            function (response) {

                console.error(
                    "Razorpay Payment Failed:",
                    response
                );

                setError(
                    response.error?.description ||
                    "Payment failed. Please try again."
                );

                setLoading(false);
            }
        );


        razorpay.open();
    };


    const handlePlaceOrder = async () => {

        try {

            setLoading(true);
            setError("");


            if (!cartItems.length) {

                setError("Your cart is empty.");

                return;
            }


            const orderData = {

                items: cartItems.map((item) => ({

                    product: item.product._id,

                    quantity: item.quantity,

                })),

                shippingAddress,

                paymentMethod,

            };


            if (paymentMethod === "COD") {

                await handleCODOrder(orderData);

            } else if (paymentMethod === "RAZORPAY") {

                await handleRazorpayOrder(orderData);

            } else {

                setError(
                    "Invalid payment method."
                );

            }

        } catch (error) {

            console.error(
                "Place Order Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to place order."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl text-white font-bold mb-8">
                Review Your Order
            </h1>


            {error && (

                <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">

                    {error}

                </div>

            )}


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
                                        src={
                                            item.product.images?.[0]?.url
                                        }
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
                                        ₹
                                        {item.product.price *
                                            item.quantity}
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

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{subtotal.toFixed(2)}
                        </span>

                    </div>


                    <div className="flex justify-between mb-3">

                        <span>
                            Shipping
                        </span>

                        <span>
                            ₹{shipping.toFixed(2)}
                        </span>

                    </div>


                    <div className="flex justify-between mb-3">

                        <span>
                            Tax (18%)
                        </span>

                        <span>
                            ₹{tax.toFixed(2)}
                        </span>

                    </div>


                    <hr className="my-4" />


                    <div className="flex justify-between text-xl font-bold">

                        <span>
                            Total
                        </span>

                        <span>
                            ₹{total.toFixed(2)}
                        </span>

                    </div>


                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-green-700 disabled:bg-gray-400"
                    >

                        {loading
                            ? paymentMethod === "RAZORPAY"
                                ? "Processing..."
                                : "Placing Order..."
                            : paymentMethod === "RAZORPAY"
                                ? "Pay with Razorpay"
                                : "Place Order"
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}