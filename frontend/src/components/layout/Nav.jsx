import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import api from "../../services/api.js";
import {setCart} from "../../redux/slices/cartSlice.js"
import { logout } from "../../redux/slices/authSlice";

export default function Navbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const cartItems = useSelector(
        (state)=>state.cart.items
    );

    const cartCount = cartItems.reduce(
        (total,item)=>total + item.quantity,0
    );

    useEffect(()=>{
        const loadCart = async()=>{
            if(!isAuthenticated){
                dispatch(setCart([]));
                return;
            }
            try {
                const response = await api.get("/cart");
                console.log("NAVBAR CART :",response.data);
                dispatch(setCart(response.data.cart));
            } catch (error) {
                
                console.error("Failed to load cart : ",error.response?.data||error.message);
            }
        };
        loadCart();
    },[isAuthenticated,dispatch]);

    
    return (
        <nav className="bg-gray-800 text-white shadow-md px-6 py-4 mb-4">

            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Logo */}

                <Link
                    to="/"
                    className="text-2xl font-bold text-gray-300"
                >
                    MyShop
                </Link>


                {/* Navigation */}

                <div className="flex items-center gap-6">

                    <Link
                        to="/"
                        className="hover:text-gray-300"
                    >
                        Home
                    </Link>

                    <Link
                        to="/shop"
                        className="hover:text-gray-300"
                    >
                        Shop
                    </Link>

                    


                    {/* Authentication */}

                    {!isAuthenticated ? (

                        <>
                            <Link
                                to="/login"
                                className="hover:text-gray-300"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 hover:scale-110 transition duration-300 active:scale-95"
                            >
                                Register
                            </Link>
                        </>

                    ) : (

                        <div className="flex items-center gap-4">

                            <Link
                        to="/cart"
                        className="hover:text-gray-300 flex gap-2 items-center"
                            >
                            Cart
                            {cartCount > 0 && (
                            <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {cartCount}
                             </span>
                            )}
                            </Link>

                            <Link to="/my-orders"
                            className="hover:text-gray-300 flex gap-2 items-center">
                                My Orders
                            </Link>

                            <Link
                                to="/profile"
                                className="font-semibold hover:text-gray-300 flex items-center gap-2"
                            >
                               <img src="/usericon.png" alt="usericon" className="h-7 rounded-full invert-100" />{user?.name}
                            </Link>
                            
                            <button
                                onClick={handleLogout}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-500 hover:scale-105 active:scale-95 transition duration-300"
                            >
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </nav>
    );
}