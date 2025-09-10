import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector} from "react-redux";
import { RootState } from "@/app/store";

const PrivateRoute=({children,role}:{children:JSX.Element;role:string})=>{
    const {accessToken,role:userRole}=useSelector((state:RootState)=>state.auth);
    if(!accessToken || userRole!==role){
        return <Navigate to="/auth/login" replace/>
    }

    return children;
}

export default PrivateRoute;