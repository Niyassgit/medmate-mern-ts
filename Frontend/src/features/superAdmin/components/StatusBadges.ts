import { OrderStatus, PaymentStatus } from "../dto/OrderTableDTO";

export const getOrderStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case OrderStatus.CONFIRMED:
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case OrderStatus.SHIPPED:
      return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100";
    case OrderStatus.DELIVERED:
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

export const getPaymentStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.SUCCESS:
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case PaymentStatus.FAILED:
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};
