import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector} from "react-redux";
import { RootState } from "@/app/store";

const PrivateRoute=({children,role}:{children:JSX.Element;role:string})=>{
    const {accessToken,user}=useSelector((state:RootState)=>state.auth);
    if(!accessToken || !user ||user.role!==role){
        return <Navigate to="/auth/login" replace/>
    }

    return children;
}

export default PrivateRoute;