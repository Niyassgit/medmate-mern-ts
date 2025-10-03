import { api } from "@/services/api";
import { AdminEndpoints } from "@/services/endpoints/AdminEndpoints";

export const getAllDoctors=async(page:number=1,limit:number=10,search:string="")=>{
   const response=await api.get(AdminEndpoints.GET_DOCTORS(page,limit,search));
    return response.data.data;
}
export const getAllReps=async(page:number=1,limit:number=10,search:string="")=>{
    const response=await api.get(AdminEndpoints.GET_REPS(page,limit,search));
    return response.data.data;
}
export const blockUser=async(userId:string)=>{
    const response=await api.patch(AdminEndpoints.BLOCK_USER(userId));
    return response.data;
}
export const unblockUser=async(userId:string)=>{
    const response=await api.patch(AdminEndpoints.UNBLOCK_USER(userId));
    return response.data;
}
export const viewDoctor=async(userId:string)=>{
    const response=await api.get(AdminEndpoints.DOCTOR_DETAILS(userId));
    return response.data;
}
export const viewRep=async(userId:string)=>{
    const response=await api.get(AdminEndpoints.REP_DETAILS(userId));
    return response.data;
}