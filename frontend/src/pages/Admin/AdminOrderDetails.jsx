import { useEffect, useState } from "react";
import { ArrowLeft,Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api.js";

export default function AdminOrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status,setStatus] = useState("");
    const [trackingNumber,setTrackingNumber] = useState("");
    const [updating,setUpdating] = useState(false);

    const fetchOrder = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/order/${id}`);

            setOrder(response.data.order);
            setStatus(response.data.order.orderStatus || "PLACED");
            setTrackingNumber(response.data.order.trackingNumber || "");
        } catch (error) {
            console.error(
                "Error fetching order:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to load order"
            );

            navigate("/admin/orders");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async()=>{
        try {
            setUpdating(true);

            const response = await api.put(
                `/order/admin/${id}/status`,{
                    status,trackingNumber
                }
            );
            setOrder(response.data.order);
            alert("Order Updated successfully");
        } catch (error) {
            console.error(
                "Update order error:",
                error.response?.data || error.message
            );

            alert(error.response?.data?.message || "Failed to update order");
        }finally{
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading order...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-10 text-center text-gray-500">
                Order not found
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">

                <button
                    onClick={() => navigate("/admin/orders")}
                    className="p-2 rounded-lg hover:bg-gray-200"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Order Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                </div>

            </div>


            {/* Top Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                {/* Customer */}
                <div className="bg-white rounded-xl shadow-sm p-5">

                    <h2 className="font-semibold text-gray-800 mb-3">
                        Customer
                    </h2>

                    <p className="font-medium text-gray-800">
                        {order.user?.name || "-"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        {order.user?.email || "-"}
                    </p>

                </div>


                {/* Payment */}
                <div className="bg-white rounded-xl shadow-sm p-5">

                    <h2 className="font-semibold text-gray-800 mb-3">
                        Payment
                    </h2>

                    <p className="text-sm text-gray-500">
                        Method
                    </p>

                    <p className="font-medium text-gray-800">
                        {order.paymentMethod}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                        Status
                    </p>

                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {order.paymentStatus}
                    </span>

                </div>


                {/* Order Status */}
                <div className="bg-white rounded-xl shadow-sm p-5">

                    <h2 className="font-semibold text-gray-800 mb-3">
                        Order Status
                    </h2>

                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {order.orderStatus.replaceAll("_", " ")}
                    </span>

                    <p className="text-sm text-gray-500 mt-3">
                        Placed on
                    </p>

                    <p className="font-medium text-gray-800">
                        {new Date(order.createdAt).toLocaleString(
                            "en-IN"
                        )}
                    </p>

                </div>

            </div>


            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Products */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Ordered Products
                    </h2>

                    <div className="divide-y">

                        {order.items.map((item, index) => (

                            <div
                                key={index}
                                className="flex gap-4 py-4"
                            >

                                {/* Image */}
                                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">

                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                            No Image
                                        </div>
                                    )}

                                </div>


                                {/* Product Info */}
                                <div className="flex-1">

                                    <h3 className="font-medium text-gray-800">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        ₹{Number(
                                            item.price || 0
                                        ).toLocaleString("en-IN")} ×{" "}
                                        {item.quantity}
                                    </p>

                                </div>


                                {/* Subtotal */}
                                <div className="font-semibold text-gray-800">
                                    ₹{Number(
                                        item.subtotal || 0
                                    ).toLocaleString("en-IN")}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6 h-fit">

                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Order Summary
                    </h2>

                    <div className="space-y-3 text-sm">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Subtotal
                            </span>

                            <span>
                                ₹{Number(
                                    order.subtotal || 0
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>


                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Shipping
                            </span>

                            <span>
                                ₹{Number(
                                    order.shippingFee || 0
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>


                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Tax
                            </span>

                            <span>
                                ₹{Number(
                                    order.tax || 0
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>


                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Discount
                            </span>

                            <span>
                                -₹{Number(
                                    order.discount || 0
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>


                        <div className="border-t pt-4 flex justify-between text-base font-bold">

                            <span>
                                Total
                            </span>

                            <span>
                                ₹{Number(
                                    order.totalAmount || 0
                                ).toLocaleString("en-IN")}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Shipping Address
                </h2>

                <div className="text-gray-600 space-y-1">

                    <p className="font-medium text-gray-800">
                        {order.shippingAddress?.fullName}
                    </p>

                    <p>
                        {order.shippingAddress?.phone}
                    </p>

                    <p>
                        {order.shippingAddress?.address}
                    </p>

                    <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state} -{" "}
                        {order.shippingAddress?.postalCode}
                    </p>

                    <p>
                        {order.shippingAddress?.country}
                    </p>

                </div>

            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Manage Order

                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Status
                        </label>
                                
                            <select value={status}
                                    onChange={(e)=>setStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring focus:ring-black">
                                        <option value="PLACED">Placed</option>
                                        <option value="CONFIRMED">Confirmed</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                        <option value="DELIVERED">Deliverd</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tracking Number 
                        </label>
                        <input type="text"
                        placeholder="Enter tracking Number"
                        value={trackingNumber}
                        onChange={(e)=>setTrackingNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black" />
                    </div>

                </div>

                <div className="mt-6">
                    <button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save size={18}/>
                        {
                            updating?"Updating":"Update Order"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}