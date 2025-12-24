import { Package, TrendingUp } from "lucide-react";
import { OrderTableDTO } from "../dto/OrderTableDTO";
import { OrderStatus } from "@/types/PaymentTypes";
import { getOrderStatusBadge } from "@/types/utils/orderStatusBadge";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

interface OrderTableProps {
  orders?: OrderTableDTO[];
  loading?: boolean;
}

const OrderTable = ({ orders = [], loading = false }: OrderTableProps) => {
  const getStatusText = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (loading) return <SpinnerButton />;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Latest orders from your customers
        </p>
      </div>

      {/* Table */}
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PTR (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr
                  key={`${order.id}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 line-clamp-2">
                      {order.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {order.units}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{order.ptr.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusText(order.orderStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent orders found</p>
        </div>
      )}

      {/* Footer with total count */}
      {orders.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{orders.length}</span> recent
            order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
