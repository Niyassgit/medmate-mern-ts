import { api } from "@/services/api";
import { RepEndpoints } from "@/services/endpoints/RepEndpoints";

export const getProfileRep = async (userId: string) => {
  const response = await api.get(RepEndpoints.PROFILE(userId));
  return response.data;
};
export const updateProfileImage = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const response = await api.post(
    RepEndpoints.UPDATE_PROFILE_IMAGE(userId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const deletePost = async (userId: string, url: string) => {
  return api.delete(RepEndpoints.DELETE_IMAGE(userId, url));
};
export const completeProfile = async (userId: string, formData: FormData) => {
  return api.post(RepEndpoints.COMPLETE_PROFILE(userId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const addPost = async (id: string, formData: FormData) => {
  return api.post(RepEndpoints.ADD_POST(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getPostList = async (id: string) => {
  const response = await api.get(RepEndpoints.GET_POSTS(id));
  return response.data?.data;
};
export const postDetails = async (id: string) => {
  const response = await api.get(RepEndpoints.POST_DETAILS(id));
  return response.data?.data;
};
export const updatePost = async (id: string, formData: FormData) => {
  return await api.post(RepEndpoints.EDIT_POST(id), formData, {
    headers: { "Content-type": "multipart/form-data" },
  });
};
export const networks = async (id: string) => {
  const resp = await api.get(RepEndpoints.NETWORKS(id));
  return resp.data.data;
};
export const connectionToggle = async (id: string) => {
  return await api.post(RepEndpoints.CONNECTION_TOGGLE(id));
};
export const acceptConnection = async (id: string) => {
  const res = await api.post(RepEndpoints.ACCEPT_REQUEST(id));
  return res.data;
};
export const networkAnalytics=async(userId:string)=>{
  const res=await api.get(RepEndpoints.NETWORK_ANALYTICS(userId));
  return res.data;
}
export const archivePost=async(postId:string)=>{
  const res=await api.patch(RepEndpoints.ARCHIVE_POST(postId));
  return res.data;
}
export const deleteProductPost=async(postId:string)=>{
   const res=await api.delete(RepEndpoints.DELETE_POST(postId));
   return res.data;
}