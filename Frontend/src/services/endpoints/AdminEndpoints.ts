export const AdminEndpoints = {
  GET_DOCTORS: (
    page: number,
    limit: number,
    search: string = "",
    territory: string = ""
  ) =>
    `/admin/doctors?page=${page}&limit=${limit}&search=${search}${territory ? `&territory=${territory}` : ""
    }`,
  GET_REPS: (
    page: number,
    limit: number,
    search: string = "",
    territory: string = ""
  ) =>
    `/admin/reps?page=${page}&limit=${limit}&search=${search}${territory ? `&territory=${territory}` : ""
    }`,
  BLOCK_USER: (userId: string) => `/admin/block/${userId}`,
  UNBLOCK_USER: (userId: string) => `/admin/unblock/${userId}`,
  DOCTOR_DETAILS: (userId: string) => `/admin/doctors/${userId}`,
  REP_DETAILS: (userId: string) => `/admin/reps/${userId}`,
  GET_TERRITORIES: (
    userId: string,
    page: number,
    limit: number,
    search: string
  ) =>
    `/admin/territories/${userId}?page=${page}&limit=${limit}&search=${search}`,
  ADD_TERRITORY: `/admin/territories/create`,
  EDIT_TERRITORY: (territoryId: string) =>
    `/admin/territories/edit/${territoryId}`,
  GET_DEPARTMENTS: (
    userId: string,
    page: number,
    limit: number,
    search: string
  ) =>
    `/admin/departments/${userId}?page=${page}&limit=${limit}&search=${search}`,
  CREATE_DEPARTMENT: `/admin/departments/create`,
  EDIT_DEPARTMENTS: (departmentId: string) =>
    `/admin/departments/edit/${departmentId}`,
  SUBSCRIPTION_PLANS: `/admin/subscriptions`,
  CREATE_SUBSCRIPTION_PLAN: `/admin/subscriptions/create`,
  UPDATE_PLAN: (conversationId: string) =>
    `/admin/subscription/update/${conversationId}`,
  LIST_TOGGLE_PLAN: (conversationId: string) =>
    `/admin/subscription/toggle/${conversationId}`,
  DELETE_PLAN: (conversationId: string) =>
    `/admin/subscription/delete/${conversationId}`,
  STATS_SUMMARY: `/admin/stats/summary`,
  STATS_USER_DIS: `/admin/stats/user-distribution`,
  STATS_USER_GROWTH: `/admin/stats/user-growth`,
  STATS_REVENUE_BY_TIER: `/admin/stats/revenue-by-tier`,
  RECENT_SUBSCRIPTION: `/admin/subscriptions/recent`,
  SUBSCRIBED: (page: number, limit: number) =>
    `/admin/subscibed/list?page=${page}&limit=${limit}`,
  GET_ALL_GUESTS: (
    page: number,
    limit: number,
    search: string = "",
    territory: string = ""
  ) =>
    `/admin/guests?page=${page}&limit=${limit}&search=${search}${territory ? `&territory=${territory}` : ""
    }`,
  TERRITORY_DETAILS: (territoryId: string) => `/admin/territory/${territoryId}`,
  ORDER_ANALYTICS: `/admin/order-analytics`,
  DOCTOR_EARNINGS: (page: number, limit: number, startDate?: string, endDate?: string) => {
    let url = `/admin/stats/doctor-earnings?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return url;
  },
  ADMIN_EARNINGS: (page: number, limit: number, startDate?: string, endDate?: string) => {
    let url = `/admin/stats/admin-earnings?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return url;
  },
  GET_ALL_ORDERS: (
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string
  ) => {
    let url = `/admin/orders?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return url;
  },
};
