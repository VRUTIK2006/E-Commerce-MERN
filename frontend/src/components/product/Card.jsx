import { useDispatch } from "react-redux";
import { setCart } from "../../redux/slices/cartSlice";
import { addToCartAPI } from "../../services/cartService";
import { useNavigate } from "react-router-dom";

export default function Card({ product }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = async () => {

        try {

            const response = await addToCartAPI(product._id);

            // Update Redux with the cart returned by backend
            dispatch(setCart(response.cart));

            // Go to cart
            navigate("/cart");

        } catch (error) {

            console.error("Add to cart error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );
        }
    };

    return (
        <>
            <div className="bg-gray-700 p-2 w-64 h-auto rounded-2xl flex flex-col  hover:shadow-lg hover:shadow-white hover:-translate-y-2 transition duration-300">

                <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-xl mb-2"
                />

                <h1 className="font-bold text-white">
                    {product.name}
                </h1>

                <p className="mb-2 text-gray-400">
                    {product.description}
                </p>

                <p className="mb-2 text-white">
                    Rs.{product.price}
                </p>

                <button
                    onClick={handleAddToCart}
                    className="bg-green-600 text-white py-2 rounded-2xl hover:scale-105 transition"
                >
                    Add to Cart
                </button>

            </div>
        </>
    );
}