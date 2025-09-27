export const DoctorEndpoints={
  REGISTER : "/doctor/signup",
  PROFILE:((userId:string)=>`/doctor/profile/${userId}`),

}
