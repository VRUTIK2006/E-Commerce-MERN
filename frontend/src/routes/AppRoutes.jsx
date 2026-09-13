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
import VerifyOTP from "../pages/Auth/VerifyOTP";

import AdminRoutes from "../components/admin/AdminRoutes";
import AdminLayout from "../components/admin/AdminLayout";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminProducts from "../pages/Admin/AdminProducts";
import AdminOrders from "../pages/Admin/AdminOrders";
import AdminCustomers from "../pages/Admin/AdminCustomers";
import AdminSettings from "../pages/Admin/AdminSettings";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";
import AdminOrderDetails from "../pages/Admin/AdminOrderDetails";
import AdminCustomerDetails from "../pages/Admin/AdminCustomerDetails";

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
            <Route path='/verify-otp' element={<VerifyOTP/>}/>          
    
    
            <Route element={<AdminRoutes/>}>
            <Route path="/admin" element={<AdminLayout/>}>
                <Route index element={<AdminDashboard/>}/>
                <Route path="products" element={<AdminProducts/>}/>
                <Route path="products/add" element={<AddProduct/>}/>
                <Route path="products/edit/:id" element={<EditProduct/>}/>
                <Route path="orders/:id" element={<AdminOrderDetails/>}/>
                <Route path="orders" element={<AdminOrders/>}/>
                <Route path="customers" element={<AdminCustomers/>}/>
                <Route path="customers/:id" element={<AdminCustomerDetails/>}/>
                <Route path="settings" element={<AdminSettings/>}/>
            </Route>
            </Route>
        </Routes>
        <Footer/>
        </>
        
    );
}
