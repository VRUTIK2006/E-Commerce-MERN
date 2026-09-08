import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout(){
    return(
        <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar/>
            <div className="flex-1 flex flex-col min-w-0">
                <AdminNavbar/>
                <main className="flex--1 p-6">
                    <Outlet/>
                </main>
            </div>



        </div>
    );
}