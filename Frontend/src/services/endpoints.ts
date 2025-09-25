
export const AuthEndpoints ={
  LOGIN : "/auth/login",
  REFRESH : "/auth/refresh",
  GOOGLE_PRECHECK : "/auth/google/precheck",
  GOOGLE_LOGIN : "/auth/google",
  VERIFY_OTP : "/auth/verifyotp",
  RESEND_OTP : "/auth/resendotp",
  FORGOT_PASSWORD : "/auth/forgotpassword",
  FORGOT_VERIFY_OTP : "/auth/forgotpassword/verifyotp",
  FORGOT_RESEND_OTP : "/auth/forgotpassword/resendotp",
  RESET_PASSWORD : "/auth/forgotpassword/reset",
  LOGOUT : "/auth/logout",
}
export const DoctorEndpoints={
  REGISTER : "/doctor/signup",
}

export const RepEndpoints= {
  REGISTER : "/rep/signup",
}

export const AdminEndpoints= {
  GET_DOCTORS :(page:number,limit:number,search:string="")=> `/admin/doctors?page=${page}&limit=${limit}&search=${search}`,
  GET_REPS : (page:number,limit:number,search:string="")=>`/admin/reps?page=${page}$limit=${limit}$search=${search}`,
  BLOCK_USER : (userId: string) => `/admin/block/${userId}`,
  UNBLOCK_USER : (userId: string) => `/admin/unblock/${userId}`,
  DOCTOR_DETAILS:(userId:string)=>`/admin/doctors/${userId}`,
  REP_DETAILS:(userId:string)=>`/admin/reps/${userId}`
}
