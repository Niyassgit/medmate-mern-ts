export const RepEndpoints= {
  REGISTER : "/rep/signup",
  PROFILE:((userId:string)=>`/rep/profile/${userId}`),
  UPDATE_PROFILE_IMAGE:((userId:string)=>`/rep/profile-image/${userId}`),
  COMPLETE_PROFILE:((userId:string)=>`/rep/profile/complete/${userId}`),
  UPLOAD_COMPANY_LOGO:((userId:string)=>`/rep/profile/complete/upload-logo/${userId}`),
  ADD_POST:((userId:string)=>`/rep/add-post/${userId}`),
}
