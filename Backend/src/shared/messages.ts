export const ErrorMessages = {
  USER_NOT_FOUND: "User not found",
  ACCOUNT_EXIST:"User already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN:"Forbidden",
  SERVER_ERROR: "Internal server error",
  EMAIL_ALREADY_EXISTS : "Email already exists",
  PASSWORD_REQUIRED : "Password is required",
  USER_BLOCKED:"User is Blocked by admin",
  INVALID_REFRESHTOKEN:"Invalid refresh token",
  GOOGLE_UNAUTHRISED:"Google account has no email", 
  VERIFY_EMAIL:"Please verify email before logging in",
  RETRY_LATER:"Retry later",
  PASSWORD_CANT_SAME: "New password cannot be the same as the old password",
  OTP_INVALID:"The OTP you entered is invalid or expired. Please try again",
  PASS_RESET_FAILED:"Password reset failed",
  PASS_MATCH:"New password cannot be the same as the old password",
  PROFILE_IMAGE_REQUIRED:"Profile image is required for the updation",
  PROFILE_UPDATE_FAIL:"Failed to update profile",
  FILL_ALL_FILED:"Fill all the required fields to continue posting",
  COMPLETE_PROFILE_ERROR:"You must complete your profile to continue posting...",
  UPLOAD_FAILE:"Upload operation failed",
  POST_NOT_FOUND:"The post you have looking for is not found",
  TOKEN_NOT_FOUND:"No token Provided",
  INVALID_TOKEN:"Invalid Token",
  INVALID_EDUCATION:"Invalid educations format",
  INVALID_CERTIFICATE:"Invalid certificate format",
  BLOCK_FAILURE:"User BLocking Fails"

}as const;


export const SuccessMessages = {
  LOGIN_SUCCESS: "Login successful",
  PROFILE_UPDATED: "Profile updated successfully",
  REGISTER_SUCCESS: "User registered successfully",
  PASSWORD_RESET_SUCCESS:"Password changed successfully",
  ACCOUNT_VERIFIED_SUCCESS:"Account verified successfully",
  PROFILE_PIC_UPDATE:"Profile picture added Successfully",
  PROFILE_PIC_DELETE:"Profile picture deletd Successfully",
  UPLOAD_SUCCESS:"Uploaded successfully",
  POST_UPDATE_SUCCESS:"Post updated successfully",
  LOGOUT_SUCCESS:"User logout successfully",
  BLOCK_SUCCESS:"User Blocked successfully",
  UNBLOCK_SUCCESS:"User Unblocked successfully"

 
}as const;

export const NotificationMessages={
 OTP_SUBJECT: "Verify your account",
  OTP_RESET_PASSWORD: (otp: string) =>
    `Your OTP for resetting your password is ${otp}. It will expire in 10 minutes.`,
  OTP_VERIFICATION: (otp: string) =>
    `Your OTP for verifying your account is ${otp}.`,
  NEW_OTP_VERIFICATION:(otp:string)=>
    `Your New OTP is ${otp},It will expiry shortly`,


}as const;