import { JSX } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute=({children,role}:{children:JSX.Element;role:string})=>{
    const token=localStorage.getItem("token");
    const userRole=localStorage.getItem("role");
           if(!token || userRole !==role){  
            return <Navigate to={`/login/${role.toLowerCase()}`} replace/>
           }
           return children;
}

export default PrivateRoute;