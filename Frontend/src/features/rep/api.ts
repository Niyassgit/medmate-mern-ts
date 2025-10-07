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
export const completeProfile=async(userId:string,formData:FormData)=>{
  console.log("the data before sending to the api:",formData);
  for(let [key,val] of formData.entries()){
    console.log(key,val);
  }
  return api.post(RepEndpoints.COMPLETE_PROFILE(userId),formData,{
    headers:{"Content-Type":"multipart/form-data"}
  })
}
export const addPost=async(id:string,formData:FormData)=>{
  return api.post(RepEndpoints.ADD_POST(id),formData,{
    headers:{"Content-Type":"multipart/form-data"},
  });
}