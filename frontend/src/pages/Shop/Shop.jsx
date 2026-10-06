import { useEffect,useState } from "react";
import api from "../../services/api";
import Card from "../../components/product/Card";
import {X,Search} from "lucide-react";

export default function Shop(){
    const [products,setProducts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const [search,setSearch] = useState("");
    const [selectedCat,setSelectedCat] = useState([]);

    const filteredProducts = products.filter((product)=>{
        const matchSerach = (product.name || "").toLowerCase().includes(search.trim());
        const catSearch = selectedCat.length === 0||selectedCat.includes(product.category);

        return matchSerach && catSearch;
    });

    const uniqueCats = Array.from(new Set(products.map((product)=>product.category).filter(Boolean)));

    const handleCatChange=(cat)=>{
        setSelectedCat(prev=>
        (prev.includes(cat) ? prev.filter((pre)=>pre!=cat):[...prev,cat]))

    }
    useEffect(()=>{
        const fetchProducts = async()=>{
            try {
                const response = await api.get("/product/products");
                setProducts(response.data.products);
            } catch (error) {
                console.error(error);
                setError("Failed to load products");
            }finally{
                setLoading(false);
            }

            
        };
        fetchProducts();
    },[]);
    if(loading){
        return <h2>Loading Products...</h2>
    }
    if(error){
        return <h2>{error}</h2>
    }
    return(
        <div className="p-6 min-h-screen">
            <div className="text-white flex items-center gap-8 mb-6">
                <h1 className="text-3xl font-bold">
                All Products
                </h1>
                <div className="flex gap-2">
                    <Search/>
                    <input type="text" name="search" id="srch"
                    value={search} onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search Products...." 
                    className="rounded-xl border border-white text-white px-4"/>
                    {search && (
                        <button onClick={()=>setSearch("")}>
                        <X className="cursor-pointer"/>
                        </button>
                    )}                                        
                </div>
            
            </div>
            
            <div className="flex gap-8">
                    <div className="flex flex-col gap-2 text-white shrink-0">
                        {uniqueCats.map((cat)=>(
                            <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-300">
                                <input type="checkbox" 
                                checked={selectedCat.includes(cat)}
                                onChange={()=>handleCatChange(cat)}
                                className="rounded accent-green-500 cursor-pointer w-4 h-4 mx-2"/>
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>
                   <div className="flex flex-wrap justify-center gap-10">
                {filteredProducts.length<1 ? (
                    <h2 className="text-xl text-white">No Product Found...</h2>
                ):(
                    filteredProducts.map((product)=>(
                    <Card
                    key={product._id}
                    product={product}
                    />
                )))}
            </div>
            </div>
           

        </div>
    )
}