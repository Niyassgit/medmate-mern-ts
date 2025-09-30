export const RepEndpoints= {
  REGISTER : "/rep/signup",
  PROFILE:((userId:string)=>`/rep/profile/${userId}`),
  UPDATE_PROFILE_IMAGE:((userId:string)=>`/rep/profile-image/${userId}`)
}
