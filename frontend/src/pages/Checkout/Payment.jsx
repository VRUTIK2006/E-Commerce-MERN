import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPaymentMethod as setPaymentMethodAction } 
  from "../../redux/slices/checkoutSlice";
export default function Payment() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const [paymentMethod, setPaymentMethod] = useState("");

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 100 : 0;

    const total = subtotal + shipping;

    const handleContinue = () => {

    if (!paymentMethod) {
        alert("Please select a payment method");
        return;
    }

    if (paymentMethod === "razorpay") {
        alert("Razorpay integration is not configured yet.");
        return;
    }
    dispatch(setPaymentMethodAction(paymentMethod));
    navigate("/review-order");
};

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">
                Payment Method
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* PAYMENT METHODS */}

                <div className="lg:col-span-2">

                    <div className="bg-white shadow-md rounded-xl p-6">

                        <h2 className="text-xl font-bold mb-6">
                            Select Payment Method
                        </h2>

                        {/* RAZORPAY */}

                        <label
                            className={`flex items-center gap-4 border p-5 rounded-xl mb-4 cursor-pointer ${
                                paymentMethod === "razorpay"
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-300"
                            }`}
                        >

                            <input
                                type="radio"
                                name="payment"
                                value="razorpay"
                                checked={
                                    paymentMethod === "razorpay"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <div>

                                <h3 className="font-semibold">
                                    Razorpay
                                </h3>

                                <p className="text-sm text-gray-500">
                                    UPI, Cards, Net Banking and Wallets
                                </p>

                            </div>

                        </label>


                        {/* COD */}

                        <label
                            className={`flex items-center gap-4 border p-5 rounded-xl cursor-pointer ${
                                paymentMethod === "cod"
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-300"
                            }`}
                        >

                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={
                                    paymentMethod === "COD"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <div>

                                <h3 className="font-semibold">
                                    Cash on Delivery
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Pay when your order is delivered
                                </p>

                            </div>

                        </label>


                        {/* CONTINUE */}

                        <button
                            onClick={handleContinue}
                            disabled={!paymentMethod}
                            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>

                    </div>

                </div>


                {/* ORDER SUMMARY */}

                <div className="bg-gray-100 rounded-xl p-6 h-fit">

                    <h2 className="text-xl font-bold mb-5">
                        Order Summary
                    </h2>

                    <div className="space-y-3">

                        {cartItems.map((item) => (

                            <div
                                key={item._id}
                                className="flex justify-between"
                            >

                                <span>
                                    {item.product.name} × {item.quantity}
                                </span>

                                <span>
                                    ₹{item.product.price * item.quantity}
                                </span>

                            </div>

                        ))}

                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <span>Shipping</span>
                        <span>₹{shipping}</span>
                    </div>

                    <div className="flex justify-between mt-4 text-xl font-bold">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>

                </div>

            </div>

        </div>
    );
}