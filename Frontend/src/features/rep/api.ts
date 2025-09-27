import { api } from "@/services/api";
import { RepEndpoints } from "@/services/endpoints/RepEndpoints";

export const getProfileRep = async (userId: string) => {
  const response = await api.get(RepEndpoints.PROFILE(userId));
  return response.data;
};
