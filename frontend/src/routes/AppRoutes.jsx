import {Routes,Route} from "react-router-dom";

import Nav from "../components/layout/Nav";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Shop from "../pages/Shop/Shop";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Payment from "../pages/Checkout/Payment";
import ReviewOrder from "../pages/Checkout/ReviewOrder";
import OrderSuccess from "../pages/Order/OrderSuccess";
import MyOrders from "../pages/Order/MyOrders";
import OrderTracking from "../pages/Order/OrderTracking";
import Footer from "../components/layout/Footer";

export default function AppRoutes(){
    return(
        <>
        <Nav/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/shop' element={<Shop/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/checkout' element={<Checkout/>}/>
            <Route path='/payment' element={<Payment/>}/>
            <Route path='/review-order' element={<ReviewOrder/>}/>
            <Route path='/order-success' element={<OrderSuccess/>}/>
            <Route path='/my-orders' element={<MyOrders/>}/>
            <Route path='/order/:id' element={<OrderTracking/>}/>            
        </Routes>
        <Footer/>
        </>
        
    )
}