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
  CONNECTION_TOGGLE: (doctorId: string) => `/rep/connect/${doctorId}`,
  ACCEPT_REQUEST: (doctorId: string) => `/rep/connection/accept/${doctorId}`,
  NETWORK_ANALYTICS: (userId: string) => `/rep/analytics/${userId}`,
  ARCHIVE_POST: (postId: string) => `/rep/post/archive/${postId}`,
  DELETE_POST: (postId: string) => `/rep/post/delete/${postId}`,
  DOCTOR_PROFILE: (doctorId: string) => `/rep/doctor/details/${doctorId}`,
  MUTUAL_CONNECTIONS: (userId: string) =>
    `/rep/analytics/mutual-connections/${userId}`,
  PENDING_CONNECITONS: (userId: string) =>
    `/rep/analytics/pending-connections/${userId}`,
  NOTIFICATIONS: (userId: string) => `/rep/notifications/${userId}`,
  REJECT_CONNECTION_REQUEST: (notificationId: string, doctorId: string) =>
    `/rep/notifications/connection/${notificationId}/reject/${doctorId}`,
};
