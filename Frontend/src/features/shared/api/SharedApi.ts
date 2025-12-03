import { api } from "@/services/api";
import { CommonEndpoints } from "@/services/endpoints/CommonEndpoints";

export const getDepartments=async()=>{
  return await api.get(CommonEndpoints.DEPARTMENTS);
}
export const getTerritories=async()=>{
  return await api.get(CommonEndpoints.TERRITORIES);
}
export const doctorsForShow=async()=>{
  const res= await api.get(CommonEndpoints.DOCTORS);
  return res.data.data;
}