import { useEffect, useState } from "react";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function AdminProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await api.get("/product/products");
            setProducts(response.data.products || []);

        } catch (error) {

            console.error(
                "Error fetching products:",
                error.response?.data || error.message
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/product/delete-product/${id}`);

            setProducts((prevProducts) =>
                prevProducts.filter(
                    (product) => product._id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete product error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };


    const filteredProducts = products.filter((product) =>
        product.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    return (
        <div>

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Products
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your store products
                    </p>
                </div>


                <button
                    onClick={() => navigate("/admin/products/add")}
                    className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                    <Plus size={18} />
                    Add Product
                </button>

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
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-none focus:ring-2 focus:ring-black"
                    />

                </div>

            </div>


            {/* Products */}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {loading ? (

                    <div className="p-10 text-center text-gray-500">
                        Loading products...
                    </div>

                ) : filteredProducts.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">
                        No products found
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Product
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Category
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Price
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Stock
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {filteredProducts.map((product) => (

                                    <tr
                                        key={product._id}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* Product */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">

                                                    {product.images?.[0]?.url ? (

                                                        <img
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                            No Image
                                                        </div>

                                                    )}

                                                </div>


                                                <div>

                                                    <p className="font-medium text-gray-800">
                                                        {product.name}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {product.brand}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Category */}

                                        <td className="px-6 py-4 text-gray-600">
                                            {product.category}
                                        </td>


                                        {/* Price */}

                                        <td className="px-6 py-4 font-medium">
                                            ₹{product.price}
                                        </td>


                                        {/* Stock */}

                                        <td className="px-6 py-4">
                                            {product.stock}
                                        </td>


                                        {/* Status */}

                                        <td className="px-6 py-4">

                                            {product.stock > 0 ? (

                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    In Stock
                                                </span>

                                            ) : (

                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Out of Stock
                                                </span>

                                            )}

                                        </td>


                                        {/* Actions */}

                                        <td className="px-6 py-4">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/products/edit/${product._id}`
                                                        )
                                                    }
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleDelete(product._id)
                                                    }
                                                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
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