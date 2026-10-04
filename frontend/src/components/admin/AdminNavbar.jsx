import {Bell,User} from "lucide-react";

export default function AdminNavbar(){
    return(
        <header className="h-16 my-2 rounded-2xl flex items-center justify-between px-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-100">
                    Admin Panel

                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative text-gray-100 hover:scale-105">
                    <Bell size={21}/>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full">
                    </span>
                </button>

            <div className="flex items-center gap-3">
                <div className="text-gray-100 font-semibold">
                    <p>Admin Name</p>
                </div>

            </div>

            </div>

        </header>
    );
}