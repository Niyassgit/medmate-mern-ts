import { api } from "@/services/api";
import { DoctorEndpoints } from "@/services/endpoints/DoctorEndpoints";

export const getProfileDoctor=async(id:string)=>{
    const response=await api.get(DoctorEndpoints.PROFILE(id));
    return response.data;
}