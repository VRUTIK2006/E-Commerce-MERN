import { useEffect, useState } from "react";
import {
    Package,
    ShoppingCart,
    Users,
    IndianRupee
} from "lucide-react";

import api from "../../services/api";


export default function AdminDashboard() {

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    "/admin/dashboard"
                );

                console.log(
                    "Dashboard:",
                    response.data
                );
                console.log(response.data);
                setStats(response.data.status);

            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchDashboardStats();

    }, []);


    return (

        <div>

            {/* Header */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Welcome back, Admin 👋
                </p>

            </div>


            {/* Error */}

            {error && (

                <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">

                    {error}

                </div>

            )}


            {/* Statistics */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


                {/* Products */}

                <div className="bg-white p-5 rounded-xl shadow-sm border">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Total Products
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-gray-800">

                                {loading
                                    ? "..."
                                    : stats.totalProducts}

                            </h2>

                        </div>

                        <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">

                            <Package
                                size={22}
                                className="text-blue-600"
                            />

                        </div>

                    </div>

                </div>


                {/* Orders */}

                <div className="bg-white p-5 rounded-xl shadow-sm border">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-gray-800">

                                {loading
                                    ? "..."
                                    : stats.totalOrders}

                            </h2>

                        </div>

                        <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">

                            <ShoppingCart
                                size={22}
                                className="text-green-600"
                            />

                        </div>

                    </div>

                </div>


                {/* Customers */}

                <div className="bg-white p-5 rounded-xl shadow-sm border">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Total Customers
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-gray-800">

                                {loading
                                    ? "..."
                                    : stats.totalCustomers}

                            </h2>

                        </div>

                        <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">

                            <Users
                                size={22}
                                className="text-purple-600"
                            />

                        </div>

                    </div>

                </div>


                {/* Revenue */}

                <div className="bg-white p-5 rounded-xl shadow-sm border">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Total Revenue
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-gray-800">

                                {loading
                                    ? "..."
                                    : `₹${stats.totalRevenue.toLocaleString("en-IN")}`}

                            </h2>

                        </div>

                        <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">

                            <IndianRupee
                                size={22}
                                className="text-yellow-600"
                            />

                        </div>

                    </div>

                </div>


            </div>


            {/* Empty area for now */}

            <div className="mt-6 bg-white rounded-xl border shadow-sm min-h-75 flex items-center justify-center">

                <p className="text-gray-400">
                    More dashboard features will be added later.
                </p>

            </div>

        </div>

    );

}