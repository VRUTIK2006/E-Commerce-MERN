import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getOrderByIdAPI } from "../../services/orderService";


export default function OrderTracking() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadOrder = async () => {

            try {

                const response =
                    await getOrderByIdAPI(id);

                console.log("TRACKING ORDER:", response);

                setOrder(response.order);

            } catch (error) {

                console.error(
                    "Failed to load order:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load order"
                );

            } finally {

                setLoading(false);

            }
        };


        loadOrder();

    }, [id]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-xl">
                    Loading order...
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

                    <h2 className="text-xl font-bold text-red-500 mb-4">
                        {error}
                    </h2>

                    <button
                        onClick={() => navigate("/my-orders")}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    >
                        Back to My Orders
                    </button>

                </div>

            </div>
        );

    }


    if (!order) {
        return null;
    }


    // =========================
    // ORDER STATUS
    // =========================

    const statuses = [
        "PLACED",
        "PROCESSING",
        "SHIPPED",
        "OUT FOR DELIVERY",
        "DELIVERED"
    ];


    const currentStatusIndex =
        statuses.indexOf(order.orderStatus);


    return (

        <div className="max-w-5xl mx-auto p-6">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-white">
                        Track Order
                    </h1>

                    <p className="text-gray-400 mt-1">
                        Order #{order._id}
                    </p>

                </div>


                <button
                    onClick={() => navigate("/my-orders")}
                    className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                    My Orders
                </button>

            </div>


            {/* CURRENT STATUS */}

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-gray-500">
                            Current Status
                        </p>

                        <h2 className="text-2xl font-bold">
                            {order.orderStatus}
                        </h2>

                    </div>


                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                        {order.orderStatus}
                    </div>

                </div>

            </div>


            {/* TRACKING TIMELINE */}

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">

                <h2 className="text-xl font-bold mb-8">
                    Order Tracking
                </h2>


                <div className="space-y-8">

                    {statuses.map((status, index) => {

                        const completed =
                            currentStatusIndex >= index;


                        const isCurrent =
                            currentStatusIndex === index;


                        return (

                            <div
                                key={status}
                                className="flex items-center gap-5"
                            >

                                {/* CIRCLE */}

                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                        completed
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                                >

                                    {completed
                                        ? "✓"
                                        : index + 1}

                                </div>


                                {/* STATUS */}

                                <div>

                                    <h3
                                        className={`font-semibold ${
                                            completed
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {status}
                                    </h3>


                                    {isCurrent && (

                                        <p className="text-sm text-gray-500">
                                            Your order is currently here
                                        </p>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>


            {/* ORDER ITEMS */}

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">

                <h2 className="text-xl font-bold mb-5">
                    Ordered Items
                </h2>


                <div className="space-y-4">

                    {order.items.map((item, index) => (

                        <div
                            key={item._id || index}
                            className="flex items-center gap-4 border-b pb-4"
                        >

                            {/* IMAGE */}

                            {item.image ? (

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />

                            ) : (

                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-sm">
                                    No Image
                                </div>

                            )}


                            {/* INFO */}

                            <div className="flex-1">

                                <h3 className="font-semibold">
                                    {item.name}
                                </h3>

                                <p className="text-gray-500">
                                    Quantity: {item.quantity}
                                </p>

                                <p className="text-gray-600">
                                    Rs. {item.price}
                                </p>

                            </div>


                            {/* SUBTOTAL */}

                            <p className="font-semibold">
                                Rs. {item.subtotal}
                            </p>

                        </div>

                    ))}

                </div>

            </div>


            {/* SHIPPING ADDRESS */}

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">

                <h2 className="text-xl font-bold mb-4">
                    Delivery Address
                </h2>


                <div className="text-gray-600 space-y-1">

                    <p>
                        <strong>
                            {order.shippingAddress?.name}
                        </strong>
                    </p>

                    <p>
                        {order.shippingAddress?.address}
                    </p>

                    <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                    </p>

                    <p>
                        PIN: {order.shippingAddress?.pincode}
                    </p>

                    <p>
                        Phone: {order.shippingAddress?.phone}
                    </p>

                </div>

            </div>


            {/* PAYMENT + TOTAL */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <h2 className="text-xl font-bold mb-5">
                    Order Summary
                </h2>


                <div className="space-y-3">

                    <div className="flex justify-between">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            Rs. {order.subtotal}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span>
                            Shipping
                        </span>

                        <span>
                            Rs. {order.shippigFee}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span>
                            Tax
                        </span>

                        <span>
                            Rs. {order.tax}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span>
                            Discount
                        </span>

                        <span>
                            Rs. {order.discount}
                        </span>

                    </div>


                    <hr />


                    <div className="flex justify-between text-xl font-bold">

                        <span>
                            Total
                        </span>

                        <span>
                            Rs. {order.totalAmount}
                        </span>

                    </div>


                    <div className="pt-4">

                        <p>
                            Payment Method:
                            {" "}
                            <strong>
                                {order.paymentMethod}
                            </strong>
                        </p>

                        <p>
                            Payment Status:
                            {" "}
                            <strong>
                                {order.paymentStatus}
                            </strong>
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );
}