import { useEffect, useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api.js"

export default function EditProduct() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: ""
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    // Fetch product
    const fetchProduct = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `/product/product/${id}`
            );

            const product = response.data;

            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price ?? "",
                category: product.category || "",
                brand: product.brand || "",
                stock: product.stock ?? ""
            });

            setExistingImages(product.images || []);

        } catch (error) {

            console.error(
                "Error fetching product:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to load product"
            );

            navigate("/admin/products");

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProduct();
    }, [id]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleImageChange = (e) => {

        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 5) {
            alert("You can upload maximum 5 images");
            return;
        }

        setNewImages(selectedFiles);
    };


    const removeNewImage = (index) => {

        setNewImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setUpdating(true);

            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("brand", formData.brand);
            data.append("stock", formData.stock);


            // Only send images if admin selected new ones
            newImages.forEach((image) => {
                data.append("image", image);
            });


            await api.put(
                `/product/update-product/${id}`,
                data
            );


            alert("Product updated successfully");

            navigate("/admin/products");

        } catch (error) {

            console.error(
                "Update product error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to update product"
            );

        } finally {
            setUpdating(false);
        }
    };


    if (loading) {

        return (
            <div className="p-10 text-center text-gray-500">
                Loading product...
            </div>
        );
    }


    return (
        <div className="max-w-5xl mx-auto">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <button
                    onClick={() => navigate("/admin/products")}
                    className="p-2 rounded-lg hover:bg-gray-200"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Product
                    </h1>

                    <p className="text-gray-500">
                        Update product information
                    </p>
                </div>

            </div>


            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm p-6"
            >

                {/* Basic Information */}

                <h2 className="text-lg font-semibold mb-5">
                    Basic Information
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Name */}

                    <div className="md:col-span-2">

                        <label className="block text-sm font-medium mb-2">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>


                    {/* Category */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>


                    {/* Brand */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Brand
                        </label>

                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>


                    {/* Price */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Price
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>


                    {/* Stock */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Stock
                        </label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>


                    {/* Description */}

                    <div className="md:col-span-2">

                        <label className="block text-sm font-medium mb-2">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black resize-none"
                        />

                    </div>

                </div>


                {/* Existing Images */}

                <div className="mt-8">

                    <h2 className="text-lg font-semibold mb-4">
                        Current Images
                    </h2>

                    {existingImages.length > 0 ? (

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                            {existingImages.map((image, index) => (

                                <div
                                    key={image.public_id || index}
                                    className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                                >

                                    <img
                                        src={image.url}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-gray-500">
                            No images available
                        </p>

                    )}

                </div>


                {/* Replace Images */}

                <div className="mt-8">

                    <h2 className="text-lg font-semibold mb-2">
                        Replace Images
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                        Leave empty to keep current images.
                        Selecting new images will replace all current images.
                    </p>


                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

                        <Upload
                            size={32}
                            className="text-gray-400 mb-2"
                        />

                        <span className="font-medium text-gray-700">
                            Click to upload new images
                        </span>

                        <span className="text-sm text-gray-400 mt-1">
                            Maximum 5 images
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />

                    </label>


                    {/* New Image Preview */}

                    {newImages.length > 0 && (

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">

                            {newImages.map((image, index) => (

                                <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                                >

                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`New preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-2 right-2 bg-black text-white rounded-full p-1"
                                    >
                                        <X size={16} />
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* Buttons */}

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={updating}
                        className="px-6 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {updating
                            ? "Updating..."
                            : "Update Product"}
                    </button>

                </div>

            </form>

        </div>
    );
}