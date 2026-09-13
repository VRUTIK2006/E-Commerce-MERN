import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function AdminOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await api.get("/order/admin/all");

            setOrders(response.data.orders || []);
        } catch (error) {
            console.error(
                "Error fetching orders:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const searchText = search.toLowerCase();

        return (
            order._id.toLowerCase().includes(searchText) ||
            order.user?.name?.toLowerCase().includes(searchText) ||
            order.user?.email?.toLowerCase().includes(searchText)
        );
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            case "SHIPPED":
            case "OUT_FOR_DELIVERY":
                return "bg-blue-100 text-blue-700";

            case "PROCESSING":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPaymentStyle = (status) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-700";

            case "FAILED":
                return "bg-red-100 text-red-700";

            case "REFUNDED":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Orders
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage customer orders
                </p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

                <div className="relative">

                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search by order ID, customer name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-none focus:ring-2 focus:ring-black"
                    />

                </div>

            </div>


            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {loading ? (

                    <div className="p-10 text-center text-gray-500">
                        Loading orders...
                    </div>

                ) : filteredOrders.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">
                        No orders found
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Order
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Customer
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Date
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Amount
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Payment
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {filteredOrders.map((order) => (

                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* Order ID */}
                                        <td className="px-6 py-4">

                                            <p className="font-medium text-gray-800">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                {order.items?.length || 0} item
                                                {order.items?.length !== 1 ? "s" : ""}
                                            </p>

                                        </td>


                                        {/* Customer */}
                                        <td className="px-6 py-4">

                                            <p className="font-medium text-gray-800">
                                                {order.user?.name || "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {order.user?.email || "-"}
                                            </p>

                                        </td>


                                        {/* Date */}
                                        <td className="px-6 py-4 text-gray-600">

                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}

                                        </td>


                                        {/* Amount */}
                                        <td className="px-6 py-4 font-semibold text-gray-800">

                                            ₹{Number(
                                                order.totalAmount || 0
                                            ).toLocaleString("en-IN")}

                                        </td>


                                        {/* Payment */}
                                        <td className="px-6 py-4">

                                            <div>

                                                <p className="text-sm font-medium text-gray-700">
                                                    {order.paymentMethod}
                                                </p>

                                                <span
                                                    className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStyle(
                                                        order.paymentStatus
                                                    )}`}
                                                >
                                                    {order.paymentStatus}
                                                </span>

                                            </div>

                                        </td>


                                        {/* Order Status */}
                                        <td className="px-6 py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {order.orderStatus.replaceAll(
                                                    "_",
                                                    " "
                                                )}
                                            </span>

                                        </td>


                                        {/* Action */}
                                        <td className="px-6 py-4">

                                            <div className="flex justify-end">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/orders/${order._id}`
                                                        )
                                                    }
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                                    title="View Order"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}