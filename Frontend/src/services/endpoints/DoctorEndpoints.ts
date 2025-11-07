export const DoctorEndpoints={
  REGISTER : "/doctor/signup",
  PROFILE:((userId:string)=>`/doctor/profile/${userId}`),
  UPDATE_PROFILE_IMAGE:((id:string)=>`/doctor/profile-image/${id}`),
  COMPLETE_PROFILE:((id:string)=>`/doctor/profile/complete/${id}`),
  NETWORKS:(id:string)=>`/doctor/networks/${id}`,
  CONNECTION_TOGGLE:(repId:string)=>`/doctor/connect/${repId}`,
  ACCEPT_REQUEST:(repId:string)=>`/doctor/connections/accept/${repId}`,
  NETWORK_ANALYTICS:(userId:string)=>`/doctor/analytics/${userId}`,
  REP_FEED:(userId:string)=>`/doctor/feed/${userId}`,
  POST_DETAILS:(postId:string)=>`/doctor/feed/post-details/${postId}`,
  REP_DETAILS:(repId:string)=>`/doctor/rep/details/${repId}`,
}
