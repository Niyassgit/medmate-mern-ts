import { api } from "@/services/api";
import { RepEndpoints } from "@/services/endpoints/RepEndpoints";
import { MessageType } from "@/types/MessageTypes";
import { ProductPostListStatus } from "@/types/ProductListStatus";
import { Role } from "@/types/Role";

export const getProfileRep = async (userId: string) => {
  const response = await api.get(RepEndpoints.PROFILE(userId));
  return response.data;
};
export const updateProfileImage = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const response = await api.post(
    RepEndpoints.UPDATE_PROFILE_IMAGE(userId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const deletePost = async (userId: string, url: string) => {
  return api.delete(RepEndpoints.DELETE_IMAGE(userId, url));
};
export const completeProfile = async (userId: string, formData: FormData) => {
  return api.post(RepEndpoints.COMPLETE_PROFILE(userId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const addPost = async (id: string, formData: FormData) => {
  return api.post(RepEndpoints.ADD_POST(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getPostList = async (
  id: string,
  status: ProductPostListStatus
) => {
  const response = await api.get(RepEndpoints.GET_POSTS(id), {
    params: { status },
  });
  return response.data?.data;
};
export const postDetails = async (id: string) => {
  const response = await api.get(RepEndpoints.POST_DETAILS(id));
  return response.data?.data;
};
export const updatePost = async (id: string, formData: FormData) => {
  return await api.post(RepEndpoints.EDIT_POST(id), formData, {
    headers: { "Content-type": "multipart/form-data" },
  });
};
export const networks = async (
  id: string,
  search?: string,
  filters?: { opTime?: string; ageRange?: number[] }
) => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (filters?.opTime && filters.opTime !== "any")
    params.opTime = filters.opTime;
  if (filters?.ageRange && filters.ageRange.length === 2) {
    params.minAge = String(filters.ageRange[0]);
    params.maxAge = String(filters.ageRange[1]);
  }
  const res = await api.get(RepEndpoints.NETWORKS(id), { params });
  return res.data.data;
};
export const connectionToggle = async (id: string) => {
  return await api.post(RepEndpoints.CONNECTION_TOGGLE(id));
};
export const acceptConnection = async (doctorId: string) => {
  const res = await api.post(RepEndpoints.ACCEPT_REQUEST(doctorId));
  return res.data;
};
export const networkAnalytics = async (userId: string) => {
  const res = await api.get(RepEndpoints.NETWORK_ANALYTICS(userId));
  return res.data;
};
export const archivePost = async (postId: string) => {
  const res = await api.patch(RepEndpoints.ARCHIVE_POST(postId));
  return res.data;
};
export const deleteProductPost = async (postId: string) => {
  const res = await api.delete(RepEndpoints.DELETE_POST(postId));
  return res.data;
};
export const doctorDetails = async (doctorId: string) => {
  const res = await api.get(RepEndpoints.DOCTOR_PROFILE(doctorId));
  return res.data;
};
export const RepMutualConnections = async (userId: string) => {
  const { data } = await api.get(RepEndpoints.MUTUAL_CONNECTIONS(userId));
  return data.data;
};
export const RepPendingConnections = async (userId: string) => {
  const { data } = await api.get(RepEndpoints.PENDING_CONNECITONS(userId));
  return data.data;
};
export const getRepnotifications = async (
  userId: string,
  cursor?: string,
  limit: number = 20
) => {
  const res = await api.get(RepEndpoints.NOTIFICATIONS(userId), {
    params: { cursor, limit },
  });
  return res.data;
};
export const rejectRepsideConnectionRequest = async (
  notificationId: string,
  doctorId: string
) => {
  const res = await api.post(
    RepEndpoints.REJECT_CONNECTION_REQUEST(notificationId, doctorId)
  );
  return res.data;
};
export const acceptFromNotification = async (
  notificationId: string,
  doctorId: string
) => {
  const res = await api.post(
    RepEndpoints.ACCEPT_REQ_ON_NOTIFICATION_PAGE(notificationId, doctorId)
  );
  return res.data;
};

export const notificationMarkAsRead = async (notificationId: string) => {
  return await api.patch(
    RepEndpoints.MARK_AS_READ_NOTIFICATION(notificationId)
  );
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return await api.patch(RepEndpoints.MARK_ALL_NOT_AS_READ(userId));
};

export const unreadNotificationCount = async (userId: string) => {
  const { data } = await api.get(
    RepEndpoints.COUNT_UNREAD_NOTIFICATION(userId)
  );
  return data;
};

export const repConversations = async () => {
  const { data } = await api.get(RepEndpoints.CONVERSATIONS);
  return data;
};

export const getMessagesRep = async (
  conversationId: string,
  cursor?: string | null
) => {
  const url = cursor
    ? `${RepEndpoints.GET_MESSAGES(conversationId)}?cursor=${cursor}`
    : RepEndpoints.GET_MESSAGES(conversationId);
  const res = await api.get(url);
  return res.data.data;
};

export const createMessageForRep = async (body: {
  conversationId: string;
  content: string;
  messageType: MessageType;
  senderRole: Role;
  receiverId: string;
}) => {
  const { data } = await api.post(RepEndpoints.ADD_MESSAGE, body);
  return data;
};

export const messageMarkAsReadForRep = async (conversationId: string) => {
  const res = await api.patch(RepEndpoints.MARK_AS_READ(conversationId));
  return res.data;
};

export const subcriptionPlans = async () => {
  const res = await api.get(RepEndpoints.SUBCSRIPTION_PLANS);
  return res.data.data;
};

export const checkoutSubscription = async (userId: string, planId: string) => {
  const res = await api.post(RepEndpoints.CHECKOUT_SUB, { userId, planId });
  return res.data.data;
};

export const getCheckoutDetails = async (sessionId: string) => {
  const res = await api.get(RepEndpoints.CHECKOUT_SESSION(sessionId));
  return res.data.data;
};

export const getSubscriptionStatus = async () => {
  const res = await api.get(RepEndpoints.SUBSCRIPTION_STATUS);
  return res.data.data;
};

export const getSubscriptionHistory = async () => {
  const res = await api.get(RepEndpoints.SUBSCRIPTION_HISTORY);
  return res.data.data;
};

export const getConnectionRequestStats = async () => {
  const res = await api.get(RepEndpoints.CONNECTION_REQUEST_STATS);
  return res.data.data;
};

export const uploadNewProduct = async (data: FormData) => {
  const res = await api.post(RepEndpoints.UPLOAD_NEW_PRODUCT, data);
  return res.data.data;
};
export const getProducts = async () => {
  const res = await api.get(RepEndpoints.GET_ALL_PRODUCTS);
  return res.data.data;
};

export const editProduct = async (productId: string, formData: FormData) => {
  const res = await api.patch(RepEndpoints.EDIT_PRODUCT(productId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const verifyPassword = async (password: string) => {
  const res = await api.get(RepEndpoints.VERIFY_PASSWORD, {
    params: { password },
  });
  return res.data;
};

export const changePassword = async (password: string, role: string) => {
  const res = await api.post(
    RepEndpoints.CHANGE_PASSWORD,
    {},
    {
      params: { newPassword: password, role },
    }
  );
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.get(RepEndpoints.GET_ALL_ORDERS);
  return res.data.res;
};

export const getOrderDetails = async (orderId: string) => {
  const res = await api.get(RepEndpoints.GET_ORDER_DETAILS(orderId));
  return res.data.data;
};

export const getBusinessAnalytics = async (
  startDate?: string,
  endDate?: string
) => {
  const res = await api.get(RepEndpoints.REP_BUSINESS_STAT, {
    params: { startDate, endDate },
  });
  return res.data.data;
};


