import { api } from "@/services/api";
import { RepEndpoints } from "@/services/endpoints/RepEndpoints";

export const getProfileRep = async (userId: string) => {
  const response = await api.get(RepEndpoints.PROFILE(userId));
  return response.data;
};
export const updateProfileImage=async(userId:string,file:File)=>{
  const formData=new FormData();
  formData.append("profileImage",file);
  const response=await api.post(RepEndpoints.UPDATE_PROFILE_IMAGE(userId),formData,{
    headers:{
      "Content-Type":"multipart/form-data",
    }
  });
  return response.data;
}