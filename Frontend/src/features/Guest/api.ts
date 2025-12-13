import { api } from "@/services/api";
import { GuestEndpoints } from "@/services/endpoints/GuestEndpoints";
import { AddressCreateDTO } from "./dto/AddressCreateDTO";

export const getAllPrescriptions = async () => {
  const res = await api.get(GuestEndpoints.GET_ALL_PRESCRIPTIONS);
  return res.data.data;
};
export const getAddress = async () => {
  const res = await api.get(GuestEndpoints.ADDRESS);
  return res.data.data;
};

export const createAddress = async (data: AddressCreateDTO) => {
  const res = await api.post(GuestEndpoints.ADDRESS, data);
  return res.data.data;
};

export const deleteAddress = async (addressId: string) => {
  const res = await api.delete(`${GuestEndpoints.ADDRESS}/${addressId}`);
  return res.data;
};

export const makePayment = async (
  prescriptionId: string,
  addressId: string,
  paymentMethod: string
): Promise<string | null> => {
  const res = await api.post(GuestEndpoints.MAKE_PAYMENT, {
    prescriptionId,
    addressId,
    paymentMethod,
  });
  return res.data.url;
};

export const getOrders = async () => {
  const res = await api.get(GuestEndpoints.GET_ORDERS);
  return res.data.data;
};
