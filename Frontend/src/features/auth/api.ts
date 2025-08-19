import { api } from "@/services/api";

export const doctorLogin=(values:{email:string,password:string})=>{
    return api.post("/doctor/login",values);
};
export const registerDoctor=(values:FormData)=>{
    return api.post("/doctor/signup",values,{
        headers:{
            "Content-Type":"multipart/form-data"
        },
    });
}

export const getDoctorProfile =(id:string)=>{
    return api.get(`/doctor/profile/${id}`);
}

export const repLogin=(values:{email:string,password:string})=>{
    return api.post("/rep/login",values);
}