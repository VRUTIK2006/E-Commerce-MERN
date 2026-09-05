import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCart, clearCart } from "../../redux/slices/cartSlice";
import {
    getCart,
    updateCartQuantityAPI,
    removeFromCartAPI,
} from "../../services/cartService";
import { useNavigate } from "react-router-dom";

export default function Cart() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    useEffect(() => {

        const loadCart = async () => {

            try {

                const response = await getCart();

                dispatch(setCart(response.cart));

            } catch (error) {

                console.error(
                    "Failed to load cart:",
                    error
                );

            }
        };

        loadCart();

    }, [dispatch]);

    const handleIncrease = async (productId, currentQuantity) => {

        try {

            const response = await updateCartQuantityAPI(
                productId,
                currentQuantity + 1
            );

            dispatch(setCart(response.cart));

        } catch (error) {

            console.error(
                "Failed to increase quantity:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    };

    const handleDecrease = async (productId, currentQuantity) => {

        if (currentQuantity <= 1) {
            return;
        }

        try {

            const response = await updateCartQuantityAPI(
                productId,
                currentQuantity - 1
            );

            dispatch(setCart(response.cart));

        } catch (error) {

            console.error(
                "Failed to decrease quantity:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    };


    const handleRemove = async (productId) => {

        try {

            const response = await removeFromCartAPI(
                productId
            );

            dispatch(setCart(response.cart));

        } catch (error) {

            console.error(
                "Failed to remove product:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to remove product"
            );
        }
    };


    const total = cartItems.reduce(
        (sum, item) =>
            sum +
            item.product.price *
            item.quantity,
        0
    );


    if (cartItems.length === 0) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-3xl text-white font-bold mb-3">
                        Your Cart is Empty
                    </h1>

                    <p className="text-gray-500 mb-5">
                        Add some products to your cart.
                    </p>

                    <button
                        onClick={() => navigate("/shop")}
                        className="bg-gray-500 text-white rounded-2xl px-4 py-2 cursor-pointer hover:scale-105 hover:shadow-md hover:shadow-white transition duration-300 active:scale-95"
                    >
                        Back to Shop
                    </button>

                </div>

            </div>

        );
    }

    return (

        <div className="min-h-screen max-w-6xl mx-auto p-6">

            <h1 className="text-white text-3xl font-bold mb-8">
                Shopping Cart
            </h1>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">



                <div className="lg:col-span-2 space-y-4">

                    {cartItems.map((item) => (

                        <div
                            key={item.product._id}
                            className="bg-white shadow-md rounded-xl p-4 flex gap-5 items-center"
                        >


                            <img
                                src={
                                    item.product.images?.[0]?.url
                                }
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />


                            <div className="flex-1">

                                <h2 className="font-bold text-lg">
                                    {item.product.name}
                                </h2>

                                <p className="text-gray-600">
                                    Rs. {item.product.price}
                                </p>

                            </div>

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() =>
                                        handleDecrease(
                                            item.product._id,
                                            item.quantity
                                        )
                                    }
                                    disabled={item.quantity <= 1}
                                    className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    -
                                </button>


                                <span className="font-semibold">
                                    {item.quantity}
                                </span>


                                <button
                                    onClick={() =>
                                        handleIncrease(
                                            item.product._id,
                                            item.quantity
                                        )
                                    }
                                    className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>

                            </div>

                            <p className="font-semibold w-24 text-right">

                                Rs.{" "}
                                {
                                    item.product.price *
                                    item.quantity
                                }

                            </p>


                            <button
                                onClick={() =>
                                    handleRemove(
                                        item.product._id
                                    )
                                }
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>


                        </div>

                    ))}


                    <div className="flex gap-4">

                        <button
                            onClick={() =>
                                navigate("/shop")
                            }
                            className="bg-green-600 text-white rounded-2xl px-4 py-2 cursor-pointer hover:scale-110 transition duration-300 active:scale-95"
                        >
                            Back to Shop !
                        </button>


                        <button
                            onClick={async () => {

                                try {

                                    for (const item of cartItems) {

                                        await removeFromCartAPI(
                                            item.product._id
                                        );

                                    }

                                    dispatch(clearCart());

                                } catch (error) {

                                    console.error(
                                        "Failed to clear cart:",
                                        error
                                    );

                                    alert(
                                        "Failed to clear cart"
                                    );
                                }

                            }}
                            className="bg-red-600 text-white rounded-2xl px-4 py-2 cursor-pointer hover:scale-110 transition duration-300 active:scale-95"
                        >
                            Clear Cart
                        </button>

                    </div>

                </div>

                <div className="bg-gray-100 rounded-xl p-6 h-fit">

                    <h2 className="text-xl font-bold mb-5">
                        Order Summary
                    </h2>


                    <div className="flex justify-between mb-3">

                        <span>
                            Items
                        </span>

                        <span>
                            {cartItems.reduce(
                                (sum, item) =>
                                    sum + item.quantity,
                                0
                            )}
                        </span>

                    </div>


                    <div className="flex justify-between mb-5">

                        <span>
                            Total
                        </span>

                        <span className="font-bold text-xl">
                            Rs. {total}
                        </span>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/checkout")
                        }
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                        Proceed to Checkout
                    </button>

                </div>

            </div>

        </div>

    );
}