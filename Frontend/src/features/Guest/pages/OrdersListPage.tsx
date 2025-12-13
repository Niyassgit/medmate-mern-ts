import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Package,
  User,
  CreditCard,
  Clock,
} from "lucide-react";
import { getOrders } from "../api";
import { OrderStatus, PaymentStatus } from "@/types/PaymentTypes";
import useFetchItem from "@/hooks/useFetchItem";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

interface OrderItem {
  name: string;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  guestId: string;
  prescriptionId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId: string;
  createdAt: string;
  items?: OrderItem[];
}

export default function OrderListingPage() {
  const { data, loading, error } = useFetchItem<Order[]>(getOrders);
  const orders = data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.SHIPPED:
        return "bg-indigo-100 text-indigo-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PaymentStatus.SUCCESS:
        return "bg-green-100 text-green-800";
      case PaymentStatus.FAILED:
        return "bg-red-100 text-red-800";
      case PaymentStatus.REFUNDED:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.prescriptionId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      switch (sortBy) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "amount-desc":
          return b.totalAmount - a.totalAmount;
        case "amount-asc":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return result;
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) return <SpinnerButton />;
  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load orders.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">
            Manage and track all prescription orders
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            {/* Order Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                <option value={OrderStatus.SHIPPED}>Shipped</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Payments</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.SUCCESS}>Success</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
                <option value={PaymentStatus.REFUNDED}>Refunded</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredAndSortedOrders.length} of {orders.length} orders
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredAndSortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-wrap items-start justify-between mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500 font-mono">
                        ID: {order.id.slice(-8).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Payment Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus === PaymentStatus.SUCCESS ? "PAID" : order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Payment ID:{" "}
                      {order.paymentId ? order.paymentId.slice(-8) : "-"}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Items ({order.items.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/40x40?text=Rx";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-medium text-sm text-gray-900 truncate"
                              title={item.name}
                            >
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredAndSortedOrders.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
