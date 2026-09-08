import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoutes(){
    const{user,isAuthenticated} = useSelector((state)=>state.auth);

    if(!isAuthenticated){
        return <Navigate to="login" replace/>;
    }
    if(user?.role!=="admin"){
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>


}