import { api } from "@/services/api";
import { GuestEndpoints } from "@/services/endpoints/GuestEndpoints";

export const getAllPrescriptions=async()=>{
    const res=await api.get(GuestEndpoints.GET_ALL_PRESCRIPTIONS);
    return res.data.data;
}