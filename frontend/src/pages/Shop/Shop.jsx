import { useEffect,useState } from "react";
import api from "../../services/api";
import Card from "../../components/product/Card";

export default function Shop(){
    const [products,setProducts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

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
        <div className="p-5">
            <h1 className="text-white text-3xl font-bold mb-6">
                All Products
            </h1>
            <div className="flex flex-wrap gap-5">
                {products.map((product)=>(
                    <Card
                    key={product._id}
                    product={product}
                    />
                ))}
            </div>

        </div>
    )
}