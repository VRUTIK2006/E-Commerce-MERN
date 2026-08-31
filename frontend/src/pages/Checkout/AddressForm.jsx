import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../../redux/slices/checkoutSlice";
import { useNavigate } from "react-router-dom";

export default function AddressForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const savedAddress = useSelector(
        (state) => state.checkout.shippingAddress
    );

    const [address, setAddress] = useState(savedAddress);

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        const {
            fullName,
            phone,
            address: streetAddress,
            city,
            state,
            postalCode,
        } = address;

        if (
            !fullName ||
            !phone ||
            !streetAddress ||
            !city ||
            !state ||
            !postalCode
        ) {
            setError("Please fill all address fields");
            return;
        }

        dispatch(saveShippingAddress(address));

        navigate("/payment");
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-6">

            <h2 className="text-xl font-bold mb-6">
                Delivery Address
            </h2>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={address.fullName}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={address.phone}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <textarea
                        name="address"
                        placeholder="Full Address"
                        value={address.address}
                        onChange={handleChange}
                        className="border p-3 rounded-lg md:col-span-2"
                        rows="3"
                        required
                    />

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="postalCode"
                        placeholder="postalCode"
                        value={address.postalCode}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                    Continue to Payment
                </button>

            </form>

        </div>
    );
}