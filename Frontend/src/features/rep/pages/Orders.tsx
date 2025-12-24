import { getOrderStatusBadge } from "@/types/utils/orderStatusBadge";
import { getAllOrders } from "../api";
import { IRepOrder } from "../dto/RepOrderDTO";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderStatus } from "@/types/PaymentTypes";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IRepOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status === filter
  );

  const statusFilters = [
    { label: "All Orders", value: "all" },
    { label: "Pending", value: OrderStatus.PENDING },
    { label: "Confirmed", value: OrderStatus.CONFIRMED },
    { label: "Delivered", value: OrderStatus.DELIVERED },
    { label: "Cancelled", value: OrderStatus.CANCELLED },
    { label: "Shipped", value: OrderStatus.SHIPPED },
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === OrderStatus.PENDING).length,
    confirmed: orders.filter((o) => o.status === OrderStatus.CONFIRMED).length,
    delivered: orders.filter((o) => o.status === OrderStatus.DELIVERED).length,
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 absolute top-0 left-0"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header Section */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Orders Management
              </h1>
              <p className="text-slate-600 mt-1">
                Track and manage your customer orders
              </p>
            </div>

            {/* Stats Overview */}
            <div className="flex gap-4 flex-wrap">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20">
                <div className="text-xs font-medium opacity-90">
                  Total Orders
                </div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
              <div className="bg-white border border-amber-200 px-5 py-3 rounded-xl shadow-sm">
                <div className="text-xs font-medium text-amber-600">
                  Pending
                </div>
                <div className="text-2xl font-bold text-amber-700">
                  {stats.pending}
                </div>
              </div>
              <div className="bg-white border border-emerald-200 px-5 py-3 rounded-xl shadow-sm">
                <div className="text-xs font-medium text-emerald-600">
                  Delivered
                </div>
                <div className="text-2xl font-bold text-emerald-700">
                  {stats.delivered}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {statusFilters.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  filter === status.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                onClick={() => navigate(`/rep/business/orders/${order.id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/60 hover:border-blue-300/60 transition-all duration-300 cursor-pointer overflow-hidden"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Doctor Info Section */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                          {order.doctorName?.charAt(0) || "D"}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {order.doctorName || "Unknown Doctor"}
                        </h3>
                        <p className="text-sm text-slate-500 truncate">
                          {order.hospital}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Products Section */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Products
                      </div>
                      {order.products?.length ? (
                        <div className="flex flex-col gap-1">
                          {order.products.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                              <span className="text-sm text-slate-700 truncate">
                                {item.name}
                              </span>
                              <span className="text-xs text-slate-400 font-medium ml-auto flex-shrink-0">
                                ×{item.unit}
                              </span>
                            </div>
                          ))}
                          {order.products.length > 2 && (
                            <div className="text-xs text-slate-400 ml-4 mt-1">
                              +{order.products.length - 2} more items
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">
                          No products
                        </span>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-2 lg:items-end">
                      <div className="text-center lg:text-right">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Total Units
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {order.totalUnits}
                        </div>
                      </div>

                      <div className="text-center lg:text-right">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Amount
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center lg:ml-4">
                      <span
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize shadow-sm ${getOrderStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Arrow Icon */}
                    <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 transition-colors">
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No orders found
            </h3>
            <p className="text-slate-500">
              {filter === "all"
                ? "You don't have any orders yet"
                : `No ${filter} orders at the moment`}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;
