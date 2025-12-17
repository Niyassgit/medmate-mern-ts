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
  ACCEPT_REQ_ON_NOTIFICATION_PAGE: (notificationId: string, doctorId: string) =>
    `/rep/notifications/connection/${notificationId}/accept/${doctorId}`,
  MARK_AS_READ_NOTIFICATION: (notificationId: string) =>
    `/rep/notifications/mark-as-read/${notificationId}`,
  MARK_ALL_NOT_AS_READ: (userId: string) =>
    `/rep/notifications/mark-all-read/${userId}`,
  COUNT_UNREAD_NOTIFICATION: (userId: string) => `/rep/notifications/unread-count/${userId}`,
  CONVERSATIONS: `/rep/chat/conversations`,
  GET_MESSAGES: (conversationId: string) => `/rep/chat/messages/${conversationId}`,
  ADD_MESSAGE: `/rep/chat/message`,
  MARK_AS_READ: (conversationId: string) => `/rep/chat/message/read/${conversationId}`,
  SUBCSRIPTION_PLANS: `/rep/subscriptions`,
  CHECKOUT_SUB: `/rep/subscription/checkout`,
  CHECKOUT_SESSION: (sessionId: string) => `/rep/subscription/checkout-session/${sessionId}`,
  SUBSCRIPTION_STATUS: `/rep/subscription/status`,
  SUBSCRIPTION_HISTORY: `/rep/subscription/history`,
  CONNECTION_REQUEST_STATS: `/rep/connection-request-stats`,
  UPLOAD_NEW_PRODUCT: `/rep/product/upload`,
  GET_ALL_PRODUCTS: `/rep/products`,
  EDIT_PRODUCT: (productId: string) => `/rep/product/edit-product/${productId}`,
  VERIFY_PASSWORD: "/rep/verify-password",
  CHANGE_PASSWORD: "/rep/change-password",
};
