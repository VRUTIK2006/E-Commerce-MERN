import { useNavigate } from "react-router-dom";

export default function OrderSummary({ cartItems }) {
    const navigate = useNavigate();
    const subtotal = cartItems.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 100 : 0;

    const total = subtotal + shipping;

    return (
        <div className="bg-gray-100 rounded-xl p-6">

            <h2 className="text-xl font-bold mb-5">
                Order Summary
            </h2>

            <div className="space-y-4 mb-6">

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

            <hr className="mb-4" />

            <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span>Shipping</span>
                <span>₹{shipping}</span>
            </div>

            <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
            </div>

            <button
                onClick={()=>navigate("/payment")}
                className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 font-semibold"
            >
                Proceed to Payment
            </button>

        </div>
    );
}