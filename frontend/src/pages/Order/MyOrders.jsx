import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyOrdersAPI } from "../../services/orderService";


export default function MyOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadOrders = async () => {

            try {

                const response = await getMyOrdersAPI();

                console.log("MY ORDERS:", response);

                setOrders(response.orders || []);

            } catch (error) {

                console.error(
                    "Failed to load orders:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );

            } finally {

                setLoading(false);

            }
        };


        loadOrders();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-xl">
                    Loading your orders...
                </p>

            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <p className="text-red-500 text-lg mb-4">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );

    }


    // =========================
    // EMPTY
    // =========================

    if (orders.length === 0) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-3xl font-bold mb-3">
                        No Orders Yet
                    </h1>

                    <p className="text-gray-500 mb-6">
                        You haven't placed any orders yet.
                    </p>

                    <button
                        onClick={() => navigate("/shop")}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg"
                    >
                        Start Shopping
                    </button>

                </div>

            </div>
        );

    }


    // =========================
    // ORDERS
    // =========================

    return (

        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold text-white mb-8">
                My Orders
            </h1>


            <div className="space-y-6">

                {orders.map((order) => (

                    <div
                        key={order._id}
                        className="bg-gray-300 rounded-xl shadow-md p-6"
                    >

                        {/* TOP SECTION */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Order ID
                                </p>

                                <p className="font-semibold break-all">
                                    {order._id}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    Order Date
                                </p>

                                <p className="font-semibold">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </p>

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    {order.orderStatus}
                                </span>

                            </div>

                        </div>


                        {/* PRODUCTS */}

                        <div className="border-t border-b py-4 space-y-4">

                            {order.items.map((item, index) => (

                                <div
                                    key={item._id || index}
                                    className="flex items-center gap-4"
                                >

                                    {/* IMAGE */}

                                    {item.image? (

                                        <img
                                            src={
                                                item.image
                                            }
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />

                                    ) : (

                                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                            No Image
                                        </div>

                                    )}


                                    {/* PRODUCT INFO */}

                                    <div className="flex-1">

                                        <h2 className="font-semibold">
                                            {item.product?.name ||
                                                item.name ||
                                                "Product"}
                                        </h2>

                                        <p className="text-gray-500 text-sm">
                                            Quantity: {item.quantity}
                                        </p>

                                        <p className="text-gray-600">
                                            Rs. {item.price}
                                        </p>

                                    </div>


                                    {/* ITEM TOTAL */}

                                    <p className="font-semibold">

                                        Rs.{" "}
                                        {item.price *
                                            item.quantity}

                                    </p>

                                </div>

                            ))}

                        </div>


                        {/* BOTTOM */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">

                            <div>

                                <p className="text-gray-500">
                                    Payment
                                </p>

                                <p className="font-semibold">
                                    {order.paymentMethod}
                                </p>

                            </div>


                            <div>

                                <p className="text-gray-500">
                                    Total
                                </p>

                                <p className="text-xl font-bold">
                                    Rs. {order.totalAmount}
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate(
                                        `/order/${order._id}`
                                    )
                                }
                                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                            >
                                Track Order
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}