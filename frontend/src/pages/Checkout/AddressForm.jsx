import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../../redux/slices/checkoutSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

    const validateForm = ()=>{
        const {fullName,phone,address:streetAddress,city,state,postalCode} = address;

        const cleanName = fullName.trim();
        const cleanPhone = phone.trim();
        const cleanStreet = streetAddress.trim();
        const cleanCity = city.trim();
        const cleanState = state.trim();
        const cleanPostal = postalCode.trim();

        if(!cleanName || !cleanPhone || !cleanStreet || !cleanCity || !cleanState || !cleanPostal){
            return "Please fill out all address fields.";
        }
        if(cleanName.length < 3){
            return "Please Enter a Valid Full Name (atleast 3 char.)";
        }
        const PhoneRegex = /^[6-9]\d{9}$/;
        if(!PhoneRegex.test(cleanPhone)){
            return "Please enter valid 10-digit mobile number";
        }
        if(cleanStreet.length < 10){
            return "Please enter a complete street address (house/flat no, street, area).";
    
        }

        const pinRegex = /^\d{6}$/;
        if(!pinRegex.test(cleanPostal)){
            return "Please Enter a valid 6-digit postal/PIN code.";
        }

        return null;
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        const validationError = validateForm();
        if(validationError){
            toast.error(validationError);
            return;
        }

        const sanitizedAddress = {
            fullName: address.fullName.trim(),
            phone: address.phone.trim(),
            address: address.address.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
            postalCode: address.postalCode.trim(),
        };

        dispatch(saveShippingAddress(sanitizedAddress));
        navigate("/payment");
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-6">

            <h2 className="text-xl font-bold mb-6">
                Delivery Address
            </h2>

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