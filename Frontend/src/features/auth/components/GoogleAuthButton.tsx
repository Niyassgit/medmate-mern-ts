import { GoogleLogin } from "@react-oauth/google";
import { googelPrecheck,googleLogin } from "../api";
import { useNavigate } from "react-router-dom";
import { Role } from "@/types/Role";
const GoogleAuthButton = () => {
 const navigate=useNavigate()
 
const handleSuccess= async(credentialResponse:any)=>{
   try {
  
    const idToken=credentialResponse.credential
   
    if(!idToken){
     console.error("No ID token recieved from Google");
     return
    }
    console.log("Google ID Token",idToken);

    const precheckRes=await googelPrecheck(idToken);


    if(precheckRes.data.exists){
        const response = await googleLogin(idToken);
        console.log("Login success:",response);

        if(response.data.user.role===Role.DOCTOR) navigate("/doctor/dashboard");
        if(response.data.user.role===Role.MEDICAL_REP)navigate("/rep/dashboard");
        if(response.data.user.role===Role.SUPER_ADMIN)navigate("/admin/dashboard");
    }else{
     navigate(`select-role?idToken=${idToken}`);

    }
   } catch (error) {
   
    console.error("Google login failed",error);
   } 
}

  return (
   <GoogleLogin 
   
   onSuccess={handleSuccess}
   onError={()=>{
    console.log("Google login Failed");
   }}
 
   />
  )
}

export default GoogleAuthButton
