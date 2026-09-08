import {LayoutDashboard,Package,ShoppingCart,User,Settings,LogOut} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar(){
    const menuItems =[
        {
            name:"Dashboard",
            path:"/admin",
            icon:LayoutDashboard
        },
        {
            name:"Products",
            path:"/admin/products",
            icon:Package
        },
        {
            name:"Orders",
            path:"/admin/orders",
            icon:ShoppingCart

        },
        {
            name:"Customers",
            path:"/admin/customers",
            icon:User 
        },
        {
            name:"Settings",
            path:"/admin/settings",
            icon:Settings
        }
    ];

    return(
        <aside className="w-64 bg-white border-r min-h-screen hidden md:flex flex-col">

            <div className="h-16 flex items-center px-6 border-b">
                <h1 className="text-2xl font-bold text-green-600">
                    BuyOn

                </h1>
                <span className="ml-2 text-sm text-gray-500">
                    Admin

                </span>

            </div>

            <nav className="flex-1 p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3 px-3">
                        Menu
                </p>
                <div className="space-y-1">
                    {menuItems.map((item)=>{
                        const Icon = item.icon;
                        return(
                            <NavLink key={item.path} to={item.path} end={item.path=="/admin"}
                            className={({isActive})=>
                            `flex items-center gap-3 px-3 py-3 rounded-lg transiton ${isActive ? "bg-green-100 text-green-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>
                                <Icon size={20}/>
                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );
                    })}

                </div>

            </nav>

            <div className="p-4 border-t">
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition">
                    <LogOut size={20}/>
                    <span>
                        Logout
                    </span>
                </button>

            </div>

        </aside>
    )
}