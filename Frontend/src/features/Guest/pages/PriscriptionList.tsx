import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  Package,
  ExternalLink,
  CreditCard,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useFetchItem from "@/hooks/useFetchItem";
import { getAllPrescriptions } from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { PrescriptionDTO } from "../dto/Prescriptions";

const PrescriptionList = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchPrescriptions = useCallback(() => getAllPrescriptions(), []);

  const { data, error, loading } =
    useFetchItem<PrescriptionDTO[]>(fetchPrescriptions);

  const prescriptions = data ?? [];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: PrescriptionDTO["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: PrescriptionDTO["status"]) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotal = (items: PrescriptionDTO["items"]) => {
    return items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  };

  const handlePay = (prescriptionId: string, total: number) => {
    alert(
      `Proceeding to payment for Prescription #${prescriptionId.slice(
        -6
      )}\nTotal: ₹${total}`
    );
  };

  const handleViewProduct = (productId: string) => {
    alert(`Viewing product: ${productId}`);
  };

  if (loading) return <SpinnerButton />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Prescriptions
          </h1>
          <p className="text-gray-600">
            View and manage your medical prescriptions
          </p>
        </div>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Prescriptions Found
            </h3>
            <p className="text-gray-500">
              You don't have any prescriptions yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              const isExpanded = expandedId === prescription.id;

              return (
                <div
                  key={prescription.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <div
                    onClick={() => toggleExpand(prescription.id)}
                    className="cursor-pointer"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(
                              prescription.status
                            )}`}
                          >
                            {getStatusIcon(prescription.status)}
                            {prescription.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            ID: {prescription.id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(prescription.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>{prescription.items.length} item(s)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{calculateTotal(prescription.items)}
                          </p>
                        </div>
                        <div className="text-blue-600">
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t">
                      <div className="p-6 bg-blue-50 border-b">
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-gray-500">Created</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(prescription.createdAt)}
                              </p>
                            </div>
                          </div>

                          {prescription.linkExpiresAt && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <div>
                                <p className="text-gray-500">Link Expires</p>
                                <p className="font-medium text-gray-900">
                                  {formatDate(prescription.linkExpiresAt)}
                                </p>
                              </div>
                            </div>
                          )}

                          {prescription.expiresAt && (
                            <div className="flex items-center gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <div>
                                <p className="text-gray-500">Valid Until</p>
                                <p className="font-medium text-gray-900">
                                  {formatDate(prescription.expiresAt)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {prescription.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                              <div>
                                <p className="font-medium text-yellow-900 text-sm">
                                  Important Note
                                </p>
                                <p className="text-yellow-800 text-sm">
                                  {prescription.notes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ITEMS */}
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Prescribed Medicines
                        </h3>

                        <div className="space-y-4">
                          {prescription.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="w-24 h-24 bg-white rounded-lg overflow-hidden border">
                                <img
                                  src={item.image ?? "/placeholder.png"}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                  {item.productName}
                                </h4>

                                <p className="text-sm text-gray-600">
                                  Brand: {item.brand}
                                </p>

                                <div className="flex justify-between items-center mt-3">
                                  <div className="text-lg font-bold">
                                    ₹{item.mrp}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    Qty: {item.quantity}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    Dosage: {item.dosage}
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewProduct(item.productId);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                  >
                                    View Details{" "}
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{calculateTotal(prescription.items)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePay(
                              prescription.id,
                              calculateTotal(prescription.items)
                            );
                          }}
                          disabled={prescription.status !== "APPROVED"}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                            prescription.status === "APPROVED"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <CreditCard className="w-5 h-5" />
                          Proceed to Pay
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;
