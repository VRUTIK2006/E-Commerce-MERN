import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";

export default function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    console.log("Form submitted with:", formData);

    setError("");

    try {

        setLoading(true);

        const response = await api.post(
            "/user/login",
            formData
        );

        console.log("Login response:", response.data);

        dispatch(
            login({
                user: response.data.user,
                token: response.data.token
            })
        );

        navigate("/");

    } catch (error) {

        console.error(error);

        setError(
            error.response?.data?.message ||
            "Login failed"
        );

    } finally {

        setLoading(false);

    }
};

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <div className="bg-gray-300 w-full max-w-md p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Login to your account
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <AuthInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                    />

                    <div className="flex justify-end mb-4">

                        <Link
                            to="/forgot-password"
                            className="text-sm"
                        >
                            Forgot password?
                        </Link>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 hover:scale-105 active:scale-95 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center mt-6">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}