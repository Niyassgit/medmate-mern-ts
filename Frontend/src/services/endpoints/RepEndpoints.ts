export const RepEndpoints = {
  REGISTER: "/rep/signup",
  PROFILE: (userId: string) => `/rep/profile/${userId}`,
  UPDATE_PROFILE_IMAGE: (userId: string) => `/rep/profile-image/${userId}`,
  COMPLETE_PROFILE: (userId: string) => `/rep/profile/complete/${userId}`,
  UPLOAD_COMPANY_LOGO: (userId: string) =>
    `/rep/profile/complete/upload-logo/${userId}`,
  ADD_POST: (userId: string) => `/rep/add-post/${userId}`,
  GET_POSTS: (userId: string) => `/rep/posts/${userId}`,
  POST_DETAILS: (postId: string) => `/rep/post-details/${postId}`,
  EDIT_POST: (postId: string) => `/rep/post-edit/${postId}`,
  DELETE_IMAGE: (userId: string, url: string) =>
    `/rep/profile-image/${userId}/${url}`,
  NETWORKS: (userId: string) => `/rep/networks/${userId}`,
  CONNECTION_TOGGLE:(doctorId:string)=>`/rep/connect/${doctorId}`,
  ACCEPT_REQUEST:(doctorId:string)=>`/rep/connection/accept/${doctorId}`,
};
