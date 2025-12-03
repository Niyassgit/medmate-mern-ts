import { api } from "@/services/api";
import { AdminEndpoints } from "@/services/endpoints/AdminEndpoints";
import { TerritorySchemaDTO } from "../Schemas/TerritorySchema";
import { DepartmentSchemaDTO } from "../Schemas/DepartmentSchema";
import {
  SubscriptionPlan,
  SubscriptionPlanPayload,
} from "../dto/SubscriptionPlan";

export const getAllDoctors = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  const response = await api.get(
    AdminEndpoints.GET_DOCTORS(page, limit, search)
  );
  return response.data.data;
};
export const getAllReps = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  const response = await api.get(AdminEndpoints.GET_REPS(page, limit, search));
  return response.data.data;
};
export const blockUser = async (userId: string) => {
  const response = await api.patch(AdminEndpoints.BLOCK_USER(userId));
  return response.data;
};
export const unblockUser = async (userId: string) => {
  const response = await api.patch(AdminEndpoints.UNBLOCK_USER(userId));
  return response.data;
};
export const viewDoctor = async (userId: string) => {
  const response = await api.get(AdminEndpoints.DOCTOR_DETAILS(userId));
  return response.data;
};
export const viewRep = async (userId: string) => {
  const response = await api.get(AdminEndpoints.REP_DETAILS(userId));
  return response.data;
};
export const territories = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  const response = await api.get(
    AdminEndpoints.GET_TERRITORIES(userId, page, limit, search)
  );
  return response.data;
};
export const addTerritory = async (data: TerritorySchemaDTO) => {
  return api.post(AdminEndpoints.ADD_TERRITORY, data);
};
export const updateTerritory = async (
  territoryId: string,
  data: TerritorySchemaDTO
) => {
  return api.patch(AdminEndpoints.EDIT_TERRITORY(territoryId), data);
};
export const departments = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  const response = await api.get(
    AdminEndpoints.GET_DEPARTMENTS(userId, page, limit, search)
  );
  return response.data;
};
export const createDepartment = async (data: DepartmentSchemaDTO) => {
  return api.post(AdminEndpoints.CREATE_DEPARTMENT, data);
};
export const updateDepartment = async (
  postId: string,
  data: DepartmentSchemaDTO
) => {
  return api.patch(AdminEndpoints.EDIT_DEPARTMENTS(postId), data);
};
export const getDepartments = async () => {
  const res = await api.get(AdminEndpoints.SUBSCRIPTION_PLANS);
  return res.data;
};
export const createSubscriptionPlan = async (data: SubscriptionPlanPayload) => {
  const res = await api.post(AdminEndpoints.CREATE_SUBSCRIPTION_PLAN, data);
  return res.data;
};
export const updateSubscriptionPlan = async (
  conversationId: string,
  data: SubscriptionPlanPayload
) => {
  const res = await api.patch(AdminEndpoints.UPDATE_PLAN(conversationId), data);
  return res.data;
};
export const toggleListPlan = async (conversationId: string) => {
  const res = await api.patch(AdminEndpoints.LIST_TOGGLE_PLAN(conversationId));
  return res.data;
};
export const deleteList = async (conversationId: string) => {
  const res = await api.delete(AdminEndpoints.DELETE_PLAN(conversationId));
  return res.data;
};

export const statsSummary = async (startDate?: string, endDate?: string) => {
  const res = await api.get(AdminEndpoints.STATS_SUMMARY, {
    params: {
      startDate,
      endDate,
    },
  });

  return res.data.data;
};

export const userDistribution = async (
  startDate?: string,
  endDate?: string
) => {
  const res = await api.get(AdminEndpoints.STATS_USER_DIS, {
    params: {
      startDate,
      endDate,
    },
  });
  return res.data.data;
};

export const getUserGrowth = async (year?: string) => {
  const res = await api.get(AdminEndpoints.STATS_USER_GROWTH, {
    params: {
      year,
    },
  });

  return res.data.data;
};

export const getRevenueByTier = async (
  startDate?: string,
  endDate?: string
) => {
  const res = await api.get(AdminEndpoints.STATS_REVENUE_BY_TIER, {
    params: {
      startDate,
      endDate,
    },
  });

  return res.data.data;
};

export const getRecentSubscriptions = async (limit: number = 20) => {
  const res = await api.get(AdminEndpoints.RECENT_SUBSCRIPTION, {
    params: { limit }
  });

  return res.data.data;
};
