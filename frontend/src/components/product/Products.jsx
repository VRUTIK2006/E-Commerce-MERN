import { useEffect,useState } from "react";

export default function Products(){
    const [products, setProducts] = useState([]);

    useEffect(()=>{
        const response = fetch("http://localhost:5000/api/product/products");     
        console.log(response);      

    },[]);

    return(
        <>
        </>
    )
}