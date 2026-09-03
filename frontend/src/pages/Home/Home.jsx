import { Link } from "react-router-dom";
import Nav from "../../components/layout/Nav";
import Shop from "../Shop/Shop"
import CategoryCard from "../../components/layout/CategoryCard";

export default function Home(){
    return(<>
        <div className="p-4 flex flex-col">
            <div className="h-80 flex flex-col text-white justify-center items-center ">

                <h1 className="mb-12 font-semibold text-white text-5xl font-serif">An Ultimate E-Commerce !</h1>

                <Link to="/shop">
                    <button className="bg-gray-500 rounded-2xl px-4 py-2 cursor-pointer hover:scale-105 hover:shadow-md hover:shadow-white transition duration-300 active:scale-95"> Shop Now</button>
                </Link>

            </div>
            <div className="flex items-center justify-center mb-4">
               <CategoryCard/>
            </div>
            <div>

            </div>
          
        </div>
    </>)
}