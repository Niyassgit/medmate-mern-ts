import { api } from "@/services/api";
import { RepEndpoints } from "@/services/endpoints/RepEndpoints";
import { CompleteRepProfileDTO } from "./schemas/CompleteRepProfileDTO";

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
export const completeProfile=async(userId:string,values:CompleteRepProfileDTO)=>{
  return api.post(RepEndpoints.COMPLETE_PROFILE(userId),values,{
    headers:{" Content-Type":"application/json"}
  })
}

export const uploadCompanyLogo= async (id:string,file:File)=>{
  const formData=new FormData();
  formData.append("companyLogoUrl",file);
  return api.post(RepEndpoints.UPLOAD_COMPANY_LOGO(id),formData,{
    headers:{"Content-Type":"multipart/form-data"}
  })
}

export const addPost=async(id:string,formData:FormData)=>{
  console.log("the data form the form:",formData);
  return api.post(RepEndpoints.ADD_POST(id),formData,{
    headers:{"Content-Type":"multipart/form-data"},
  });
}