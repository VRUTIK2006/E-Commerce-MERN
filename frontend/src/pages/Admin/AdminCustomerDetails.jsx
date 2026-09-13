import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    ShoppingBag,
    IndianRupee
} from "lucide-react";
import api from "../../services/api.js";

export default function AdminCustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await api.get(
                    `/admin/customers/${id}`
                );
                console.log(response.data);
               
                setCustomer(response.data.customer);
                setOrders(response.data.orders || []);
                setTotalOrders(response.data.totalOrders || 0);
                setTotalSpent(response.data.totalSpent || 0);

            } catch (error) {
                console.error(
                    "Error fetching customer:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getStatusClass = (status) => {
        const styles = {
            PLACED: "bg-blue-100 text-blue-700",
            CONFIRMED: "bg-indigo-100 text-indigo-700",
            PROCESSING: "bg-yellow-100 text-yellow-700",
            SHIPPED: "bg-purple-100 text-purple-700",
            OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
            DELIVERED: "bg-green-100 text-green-700",
            CANCELLED: "bg-red-100 text-red-700"
        };

        return styles[status] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading customer...
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">
                    Customer not found
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">

                <button
                    onClick={() => navigate("/admin/customers")}
                    className="p-2 rounded-lg hover:bg-gray-200"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Customer Details
                    </h1>

                    <p className="text-gray-500">
                        View customer information and order history
                    </p>
                </div>

            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                <div className="flex items-center gap-4">

                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
                        {customer.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {customer.name}
                        </h2>

                        <p className="text-gray-500">
                            {customer.email}
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                    <div className="flex items-center gap-3">
                        <Mail className="text-gray-400" size={20} />

                        <div>
                            <p className="text-xs text-gray-400">
                                Email
                            </p>
                            <p className="text-sm text-gray-700">
                                {customer.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar
                            className="text-gray-400"
                            size={20}
                        />

                        <div>
                            <p className="text-xs text-gray-400">
                                Joined
                            </p>
                            <p className="text-sm text-gray-700">
                                {formatDate(customer.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <User className="text-gray-400" size={20} />

                        <div>
                            <p className="text-xs text-gray-400">
                                Verification
                            </p>

                            <span
                                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    customer.isVerified
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {customer.isVerified
                                    ? "Verified"
                                    : "Not Verified"}
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

                    <div className="flex items-center gap-3">
                        <ShoppingBag
                            className="text-gray-500"
                            size={22}
                        />

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <p className="text-2xl font-bold text-gray-800">
                                {totalOrders}
                            </p>
                        </div>
                    </div>

                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

                    <div className="flex items-center gap-3">
                        <IndianRupee
                            className="text-gray-500"
                            size={22}
                        />

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Spent
                            </p>

                            <p className="text-2xl font-bold text-gray-800">
                                ₹{totalSpent.toFixed(2)}
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            {/* Orders */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">
                        Order History
                    </h2>
                </div>

                {orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        This customer has no orders yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                        Order
                                    </th>

                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                        Date
                                    </th>

                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                        Amount
                                    </th>

                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                        Payment
                                    </th>

                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-800">
                                                #{order._id.slice(-8)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(order.createdAt)}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            ₹{order.totalAmount.toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {order.paymentMethod}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {order.orderStatus.replaceAll(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
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