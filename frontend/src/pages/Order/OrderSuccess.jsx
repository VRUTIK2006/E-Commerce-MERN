import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {

    const location = useLocation();

    const order = location.state?.order;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

            <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">

                <div className="text-6xl mb-5">
                    ✓
                </div>

                <h1 className="text-3xl font-bold mb-3">
                    Order Placed Successfully!
                </h1>

                <p className="text-gray-500 mb-6">
                    Thank you for your purchase.
                    Your order has been successfully placed.
                </p>

                {order?._id && (
                    <p className="mb-6">
                        Order ID:
                        <span className="font-semibold ml-2">
                            {order._id}
                        </span>
                    </p>
                )}

                <div className="flex gap-3 justify-center">

                    <Link
                        to="/my-orders"
                        className="bg-green-600 text-white px-5 py-3 rounded-lg"
                    >
                        My Orders
                    </Link>

                    <Link
                        to="/shop"
                        className="border border-gray-300 px-5 py-3 rounded-lg"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
}