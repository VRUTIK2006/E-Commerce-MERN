import {LayoutDashboard,Package,ShoppingCart,User,Settings,LogOut,X,Menu} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar(){

    const [isOpen,setIsOpen] = useState(false);
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
        <div className="relative p-4 flex justify-center">
        <button className="p-2 mb-2 absolute z-60 top-4 md:hidden text-white focus:outline-none hover:cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <aside className="hidden w-64 mx-2 my-2 bg-transparent rounded-2xl min-h-screen md:flex flex-col">

            <div className=" h-16  flex items-center px-6">
                <h1 className="text-2xl font-bold text-white">
                    BuyOn

                </h1>
                <span className="ml-2 text-sm text-gray-100">
                    Admin

                </span>

            </div>

            <nav className="top-4 flex-1 p-4 justify-center items-center ">
                <p className="text-xs font-semibold text-gray-100 uppercase mb-3 px-3">
                        Menu
                </p>
                <div className="space-y-1">
                    {menuItems.map((item)=>{
                        const Icon = item.icon;
                        return(
                            <NavLink key={item.path} to={item.path} end={item.path=="/admin"}
                            className={({isActive})=>
                            `flex items-center gap-3 px-3 py-3 rounded-lg transiton ${isActive ? "bg-green-100 text-green-700 font-semibold" : "text-gray-100 hover:bg-gray-400"}`}>
                                <Icon size={20}/>
                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );
                    })}

                </div>
                 <div className="absolute bottom-4">
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-100 hover:bg-red-50 hover:text-red-600 transition">
                    <LogOut size={20}/>
                    <span>
                        Logout
                    </span>
                </button>
                </div>

            </nav>

           
            

        </aside>
                {isOpen && (
                <nav className="absolute top-16 left-2 md:hidden flex-1 p-4 z-50 bg-gray-800 rounded-xl">
                <p className="text-xs font-semibold text-gray-100 uppercase mb-3 px-3">
                        Menu
                </p>
                <div className="space-y-1">
                    {menuItems.map((item)=>{
                        const Icon = item.icon;
                        return(
                            <NavLink onClick={()=>setIsOpen(!isOpen)} key={item.path} to={item.path} end={item.path=="/admin"}
                            className={({isActive})=>
                            `flex items-center gap-3 px-3 py-3 rounded-lg transiton ${isActive ? "bg-green-100 text-green-700 font-semibold" : "text-gray-100 hover:bg-gray-400"}`}>
                                <Icon size={20}/>
                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );
                    })}

                </div>
                
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-100 hover:bg-red-50 hover:text-red-600 transition">
                    <LogOut size={20}/>
                    <span>
                        Logout
                    </span>
                </button>
        

            </nav>

            )}
        </div>
       
    )
}