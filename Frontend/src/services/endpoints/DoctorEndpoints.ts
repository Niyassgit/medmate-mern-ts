export const DoctorEndpoints={
  REGISTER : "/doctor/signup",
  PROFILE:((userId:string)=>`/doctor/profile/${userId}`),
  UPDATE_PROFILE_IMAGE:((id:string)=>`/doctor/profile-image/${id}`)
}
