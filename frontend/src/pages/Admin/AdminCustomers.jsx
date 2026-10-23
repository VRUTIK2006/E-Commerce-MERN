import { useEffect, useState } from "react";
import { Search, Users, Mail, Calendar, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCustomers = async (searchValue = "") => {
        try {
            setLoading(true);

            const response = await api.get(
                `/admin/customers?search=${encodeURIComponent(searchValue)}`
            );

            setCustomers(response.data.customers || []);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-100">
                    Customers
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage registered customers
                </p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative max-w-md">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Customers Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-gray-600" />

                        <h2 className="font-semibold text-gray-400">
                            All Customers
                        </h2>
                    </div>

                    <span className="text-sm text-gray-500">
                        {customers.length} customers
                    </span>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading customers...
                    </div>
                ) : customers.length === 0 ? (
                    <div className="p-10 text-center">
                        <Users
                            size={40}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <p className="text-gray-500">
                            No customers found
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Stacked Card View (Visible only on small/medium screens < lg) */}
                        <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                            {customers.map((customer) => (
                                <div
                                    key={customer._id}
                                    className="border border-gray-200 p-4 rounded-lg flex flex-col gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold shrink-0">
                                            {customer.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-800 truncate">
                                                {customer.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                ID: {customer._id.slice(-6)}
                                            </p>
                                        </div>

                                        <div>
                                            {customer.isVerified ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Not Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100 text-gray-600">
                                        <div className="flex items-center gap-2 truncate">
                                            <Mail size={16} className="shrink-0" />
                                            <span className="truncate">{customer.email}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} />
                                            <span>{formatDate(customer.createdAt)}</span>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/admin/customers/${customer._id}`)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Data Table (Visible on lg screens and up) */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                            Customer
                                        </th>

                                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                            Email
                                        </th>

                                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                            Verification
                                        </th>

                                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                            Joined
                                        </th>
                                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {customers.map((customer) => (
                                        <tr
                                            key={customer._id}
                                            className="hover:bg-gray-50"
                                        >
                                            {/* Customer */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                                                        {customer.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {customer.name}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            ID: {customer._id.slice(-6)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail size={16} />

                                                    <span>
                                                        {customer.email}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Verification */}
                                            <td className="px-6 py-4">
                                                {customer.isVerified ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                        Not Verified
                                                    </span>
                                                )}
                                            </td>

                                            {/* Joined */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={16} />

                                                    <span>
                                                        {formatDate(customer.createdAt)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-2">
                                                <button
                                                    onClick={() => navigate(`/admin/customers/${customer._id}`)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

            </div>

        </div>
    );
}