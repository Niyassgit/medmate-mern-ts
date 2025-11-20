export const DoctorEndpoints = {
  REGISTER: "/doctor/signup",
  PROFILE: (userId: string) => `/doctor/profile/${userId}`,
  UPDATE_PROFILE_IMAGE: (id: string) => `/doctor/profile-image/${id}`,
  COMPLETE_PROFILE: (id: string) => `/doctor/profile/complete/${id}`,
  NETWORKS: (id: string) => `/doctor/networks/${id}`,
  CONNECTION_TOGGLE: (repId: string) => `/doctor/connect/${repId}`,
  ACCEPT_REQUEST: (repId: string) => `/doctor/connections/accept/${repId}`,
  NETWORK_ANALYTICS: (userId: string) => `/doctor/analytics/${userId}`,
  REP_FEED: (userId: string) => `/doctor/feed/${userId}`,
  POST_DETAILS: (postId: string) => `/doctor/feed/post-details/${postId}`,
  REP_DETAILS: (repId: string) => `/doctor/rep/details/${repId}`,
  LIKE_TOGGLE: (postId: string) => `/doctor/feed/${postId}/like/toggle`,
  INTEREST_TOGGLE: (postId: string) => `/doctor/feed/${postId}/interest/toggle`,
  MUTUAL_CONNECTIONS: (userId: string) =>
    `/doctor/analytics/mutual-connections/${userId}`,
  PENDING_REQUESTS: (userId: string) =>
    `/doctor/analytics/pending-connections/${userId}`,
  NOTIFICATIONS: (userId: string) => `/doctor/notifications/${userId}`,
  REJECT_CONNECTION_REQ: (notificationId: string, repId: string) =>
    `/doctor/notifications/connection/${notificationId}/reject/${repId}`,
  ACCEPT_ON_NOTIFICATION: (notificationId: string, repId: string) =>
    `/doctor/notifications/connection/${notificationId}/accept/${repId}`,
  MARK_NOT_AS_READ: (notificationId: string) =>
    `/doctor/notifications/mark-as-read/${notificationId}`,
  MARK_ALL_NOT_AS_READ:(userId:string)=>`/doctor/notifications/mark-all-read/${userId}`,
  COUNT_UNREAD_NOTIFICATION:(userId:string)=>`/doctor/notifications/unread-count/${userId}`,
};
