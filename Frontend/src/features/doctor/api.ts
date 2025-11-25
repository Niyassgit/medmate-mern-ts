import { api } from "@/services/api";
import { DoctorEndpoints } from "@/services/endpoints/DoctorEndpoints";
import { CompleteDoctorProfileDTO } from "./schemas/CompleteDoctorProfileSchema";
import { MessageType } from "@/types/MessageTypes";
import { Role } from "@/types/Role";

export const getProfileDoctor = async (id: string) => {
  const response = await api.get(DoctorEndpoints.PROFILE(id));
  return response.data;
};

export const updateProfileImage = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const response = await api.post(
    DoctorEndpoints.UPDATE_PROFILE_IMAGE(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const completeProfile = async (
  id: string,
  values: CompleteDoctorProfileDTO
) => {
  return api.post(DoctorEndpoints.COMPLETE_PROFILE(id), values, {
    headers: { "Content-Type": "application/json" },
  });
};

export const getNetworks = async (id: string, search?: string) => {
  const params = search ? { search } : {};
  const resp = await api.get(DoctorEndpoints.NETWORKS(id), { params });
  return resp.data.data;
};

export const connectionToggle = async (id: string) => {
  const resp = await api.post(DoctorEndpoints.CONNECTION_TOGGLE(id));
  return resp.data;
};

export const acceptRequest = async (repId: string) => {
  const res = await api.post(DoctorEndpoints.ACCEPT_REQUEST(repId));
  return res.data;
};

export const doctorAnltyics = async (id: string) => {
  const res = await api.get(DoctorEndpoints.NETWORK_ANALYTICS(id));
  return res.data;
};

export const getAllFeed = async (id: string) => {
  const res = await api.get(DoctorEndpoints.REP_FEED(id));
  return res.data;
};

export const getPostDetails = async (postId: string) => {
  const res = await api.get(DoctorEndpoints.POST_DETAILS(postId));
  return res.data;
};

export const repProfileDetails = async (repId: string) => {
  const res = await api.get(DoctorEndpoints.REP_DETAILS(repId));
  return res.data;
};

export const handleLikeToggle = async (postId: string) => {
  const res = await api.post(DoctorEndpoints.LIKE_TOGGLE(postId));
  return res.data;
};

export const handleInterestToggle = async (postId: string) => {
  const res = await api.post(DoctorEndpoints.INTEREST_TOGGLE(postId));
  return res.data;
};

export const mutualConnections = async (userId: string) => {
  const res = await api.get(DoctorEndpoints.MUTUAL_CONNECTIONS(userId));
  return res.data.data;
};

export const pendingConnections = async (userId: string) => {
  const res = await api.get(DoctorEndpoints.PENDING_REQUESTS(userId));
  return res.data.data;
};

export const getDoctorNotifications = async (userId: string) => {
  const res = await api.get(DoctorEndpoints.NOTIFICATIONS(userId));
  return res.data;
};

export const rejectdocConnectionRequest = async (
  notificationId: string,
  repId: string
) => {
  const res = await api.post(
    DoctorEndpoints.REJECT_CONNECTION_REQ(notificationId, repId)
  );
  return res.data;
};

export const acceptConnOnNotificationPage = async (
  notificationId: string,
  repId: string
) => {
  const res = await api.post(
    DoctorEndpoints.ACCEPT_ON_NOTIFICATION(notificationId, repId)
  );
  return res.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  await api.patch(DoctorEndpoints.MARK_NOT_AS_READ(notificationId));
 
};

export const markAllNotificationsAsRead=async(userId:string)=>{
  return await api.patch(DoctorEndpoints.MARK_ALL_NOT_AS_READ(userId));
}

export const notificationUnreadCount=async(userId:string)=>{
  const{data}= await api.get(DoctorEndpoints.COUNT_UNREAD_NOTIFICATION(userId));
  return data;
}

export const doctorConversations=async()=>{
  const {data}=await api.get(DoctorEndpoints.CONVERSATIONS);
  return data;
}

export const doctorMessages=async(conversationId:string)=>{
  const res=await api.get(DoctorEndpoints.GET_MESSAGES(conversationId));
  return res.data.data;
}

export const createMessageForDoctor=async(body:{
  conversationId: string;
  content: string;
  messageType: MessageType;
  senderRole: Role;
  receiverId: string;
})=>{
  const {data}=await api.post(DoctorEndpoints.ADD_MESSAGE,body);
  return data;
}
