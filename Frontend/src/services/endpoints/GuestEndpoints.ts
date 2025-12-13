export const GuestEndpoints = {
  GUEST_REGISTER: "/guest/signup",
  GUEST_REGISTER_WITH_TOKEN: (shareToken: string) => `/guest/signup/${shareToken}`,
  GET_ALL_PRESCRIPTIONS: `/guest/prescriptions`,
  ADDRESS: `/guest/address`,
  MAKE_PAYMENT: `/guest/payment`,
  GET_ORDERS:`guest/orders`,
};
