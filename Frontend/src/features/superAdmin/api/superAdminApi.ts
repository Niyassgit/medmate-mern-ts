import axios from "axios";


const BASE_URL=import.meta.env.VITE_API_URL;

export const getAllDoctors=async()=>{
    const response=await axios.get(`${BASE_URL}/admin/doctors`);
    return response.data.data;
}
export const getAllReps=async()=>{
    const response=await axios.get(`${BASE_URL}/admin/reps`);
    return response.data.data;
}
export const blockUser=async(userId:string)=>{
    const response=await axios.patch(`${BASE_URL}/admin/block/${userId}`);
    return response.data;
}
export const unblockUser=async(userId:string)=>{
    const response=await axios.patch(`${BASE_URL}/admin/unblock/${userId}`);
    return response.data;
}
