import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../services/api.js"
import { login } from "../../redux/slices/authSlice.js";

export default function VerifyOTP() {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email) {
            setError("Email not found. Please register again.");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/user/verify-otp",
                {
                    email,
                    otp
                }
            );

            console.log(response.data);

            dispatch(login({
                    user: response.data.user,
                    token: response.data.token
                }));

            navigate("/");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "OTP verification failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <div className="bg-gray-300 w-full max-w-md p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold flex gap-2 items-center justify-center mb-2">
                   <img src="email.png" alt="emailicon" className="h-9"/> Verify Email
                </h1>

                <p className="text-center text-gray-600 mb-6">
                    OTP has been sent to
                    <br />

                    <strong>{email}</strong>
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        placeholder="Enter 6-digit OTP"
                        className="w-full p-3 rounded-lg border mb-4 text-center text-2xl tracking-widest"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 active:scale-95 duration-300 transition disabled:opacity-50"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify Email"}
                    </button>

                </form>

            </div>

        </div>
    );
}