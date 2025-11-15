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
export const getNetworks=async(id:string,search?:string)=>{
    const params=search ?{search}:{};
    const resp=await api.get(DoctorEndpoints.NETWORKS(id),{params});
    return resp.data.data;
}
export const connectionToggle=async (id:string)=>{
    const resp=await api.post(DoctorEndpoints.CONNECTION_TOGGLE(id));
    return resp.data;
}
export const acceptRequest=async(id:string)=>{
    const res=await api.post(DoctorEndpoints.ACCEPT_REQUEST(id));
    return res.data;
}
export const doctorAnltyics=async(id:string)=>{
    const res=await api.get(DoctorEndpoints.NETWORK_ANALYTICS(id));
    return res.data;
}
export const getAllFeed=async(id:string)=>{
    const res=await api.get(DoctorEndpoints.REP_FEED(id));
    return res.data;
}
export const getPostDetails=async(postId:string)=>{
    const res=await api.get(DoctorEndpoints.POST_DETAILS(postId));
    return res.data;
}
export const repProfileDetails=async(repId:string)=>{
    const res=await api.get(DoctorEndpoints.REP_DETAILS(repId));
    return res.data;
}
export const handleLikeToggle=async(postId:string)=>{
    const res=await api.post(DoctorEndpoints.LIKE_TOGGLE(postId));
    return res.data;
}
export const handleInterestToggle=async(postId:string)=>{
    const res=await api.post(DoctorEndpoints.INTEREST_TOGGLE(postId));
      return res.data;
}
export const mutualConnections=async(userId:string)=>{
    const res=await api.get(DoctorEndpoints.MUTUAL_CONNECTIONS(userId));
    return res.data.data;
}
export const pendingConnections=async(userId:string)=>{
    const res=await api.get(DoctorEndpoints.PENDING_REQUESTS(userId));
    return res.data.data;
}
export const getDoctorNotifications=async (userId:string)=>{
    const res=await api.get(DoctorEndpoints.NOTIFICATIONS(userId));
    return res.data;
}