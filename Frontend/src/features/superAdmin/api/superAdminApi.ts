import { api } from "@/services/api";

export const getAllDoctors=async(page:number=1,limit:number=10,search:string="")=>{
    const response=await api.get(`/admin/doctors?page=${page}&limit=${limit}&search=${search}`);
    return response.data.data;
}
export const getAllReps=async(page:number=1,limit:number=10,search:string="")=>{
    const response=await api.get(`/admin/reps?page=${page}&limit=${limit}&search=${search}`);
    return response.data.data;
}
export const blockUser=async(userId:string)=>{
    const response=await api.patch(`/admin/block/${userId}`);
    return response.data;
}
export const unblockUser=async(userId:string)=>{
    const response=await api.patch(`$/admin/unblock/${userId}`);
    return response.data;
}
