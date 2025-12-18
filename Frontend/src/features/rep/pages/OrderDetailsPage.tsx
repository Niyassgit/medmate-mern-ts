import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails } from "../api";
import { IRepOrderDetails } from "../dto/RepOrderDetailsDTO";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  User,
  Box,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderStatusBadge } from "@/types/utils/orderStatusBadge";

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IRepOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order details", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (error || !order)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600 font-medium">
          {error || "Order not found"}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            Order #{order.id.slice(-6)}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold capitalize
    ${getOrderStatusBadge(order.status)}
  `}
        >
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Box className="h-5 w-5 text-gray-500" /> Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-center">Unit Price</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Box className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        ₹{item.price || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        x{item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹{(item.price || 0) * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Info Cards */}
        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" /> Doctor
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Name
                </p>
                <p className="font-medium text-gray-900">
                  {order.prescription?.doctor?.name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Hospital
                </p>
                <p className="text-sm text-gray-700">
                  {order.prescription?.doctor?.hospital || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" /> Patient / Guest
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Name
                </p>
                <p className="font-medium text-gray-900">
                  {order.guest?.name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Contact
                </p>
                <p className="text-sm text-gray-700">
                  {order.guest?.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Address
                </p>
                <p className="text-sm text-gray-700">
                  {order.address
                    ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-500" /> Payment
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-medium capitalize">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-base font-bold">
                <span>Total Amount</span>
                <span className="text-primary">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
