import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    setPaymentMethod as setPaymentMethodAction
} from "../../redux/slices/checkoutSlice";

export default function Payment() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const [paymentMethod, setPaymentMethod] = useState("");

    const subtotal = cartItems.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    const shipping = subtotal >= 1000 ? 0 : 50;

    const tax = subtotal * 0.18;

    const total = subtotal + shipping + tax;


    const handleContinue = () => {

        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        dispatch(
            setPaymentMethodAction(paymentMethod)
        );

        navigate("/review-order");
    };


    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold text-white mb-8">
                Payment Method
            </h1>


            <div className="bg-white shadow-md rounded-xl p-6">

                <h2 className="text-xl font-bold mb-6">
                    Choose Payment Method
                </h2>


                {/* Razorpay */}

                <label className="flex items-center gap-3 border p-4 rounded-lg mb-4 cursor-pointer">

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={paymentMethod === "RAZORPAY"}
                        onChange={(e) =>
                            setPaymentMethod(e.target.value)
                        }
                    />

                    <div>
                        <p className="font-semibold">
                            Razorpay
                        </p>

                        <p className="text-gray-500 text-sm">
                            Pay securely using UPI, Card, Net Banking or Wallet
                        </p>
                    </div>

                </label>


                {/* COD */}

                <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) =>
                            setPaymentMethod(e.target.value)
                        }
                    />

                    <div>
                        <p className="font-semibold">
                            Cash on Delivery
                        </p>

                        <p className="text-gray-500 text-sm">
                            Pay when your order is delivered
                        </p>
                    </div>

                </label>


                {/* Summary */}

                <div className="mt-8 border-t pt-5">

                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>₹{shipping.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span>Tax (18%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>

                </div>


                <button
                    onClick={handleContinue}
                    className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-green-700"
                >
                    Continue to Review Order
                </button>

            </div>

        </div>
    );
}