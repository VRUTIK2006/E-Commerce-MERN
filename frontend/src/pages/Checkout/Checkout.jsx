import { useSelector } from "react-redux";
import AddressForm from "./AddressForm";
import OrderSummary from  "./OrderSummary";

export default function Checkout(){
    const cartItems  = useSelector(
        (state)=>state.cart.items 
    );

    return(
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">

                    <AddressForm/>

                </div>

                <div>
                    <OrderSummary cartItems={cartItems}/>
                </div>
        

            </div>

        </div>
    );
}