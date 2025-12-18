import { OrderStatus } from "../PaymentTypes";

export const getOrderStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-700";

    case OrderStatus.CONFIRMED:
      return "bg-blue-100 text-blue-700";

    case OrderStatus.SHIPPED:
      return "bg-indigo-100 text-indigo-700";

    case OrderStatus.DELIVERED:
      return "bg-green-100 text-green-700";

    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};
