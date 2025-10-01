import { api } from "@/services/api";
import { DoctorEndpoints } from "@/services/endpoints/DoctorEndpoints";
import { CompleteDoctorProfileDTO } from "./schemas/CompleteDoctorProfileSchema";

export const getProfileDoctor=async(id:string)=>{
    const response=await api.get(DoctorEndpoints.PROFILE(id));
    return response.data;
}
export const updateProfileImage=async(id:string,file:File)=>{
    const formData=new FormData();
    formData.append("profileImage",file);
    const response=await api.post(DoctorEndpoints.UPDATE_PROFILE_IMAGE(id),formData,{
        headers:{
          "Content-Type":"multipart/form-data",
        },
    });
    return response.data;
}
export const completeProfile=async(id:string,values:CompleteDoctorProfileDTO)=>{
    return api.post(DoctorEndpoints.COMPLETE_PROFILE(id),values,{
        headers: { "Content-Type": "application/json" },
    });
}