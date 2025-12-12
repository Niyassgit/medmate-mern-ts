import React, { useState, useCallback } from "react";
import {
  Calendar, Clock, AlertCircle, Package,
  ExternalLink, CreditCard, CheckCircle, XCircle,
  ChevronDown, ChevronUp,
} from "lucide-react";

import useFetchItem from "@/hooks/useFetchItem";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { PrescriptionDTO } from "../Dto/Prescriptions";

interface Props {
  fetcher: () => Promise<PrescriptionDTO[]>;
  title?: string;
  emptyMessage?: string;
}

const PrescriptionList: React.FC<Props> = ({
  fetcher,
  title = "Prescriptions",
  emptyMessage = "No prescriptions found.",
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(() => fetcher(), [fetcher]);

  const { data, error, loading } =
    useFetchItem<PrescriptionDTO[]>(fetchData);

  const prescriptions = data ?? [];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: PrescriptionDTO["status"]) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  const getStatusIcon = (status: PrescriptionDTO["status"]) => {
    switch (status) {
      case "APPROVED": return <CheckCircle className="w-4 h-4" />;
      case "REJECTED": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string | Date | undefined) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  const calculateTotal = (items: PrescriptionDTO["items"]) =>
    items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);

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
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-black mb-2">{title}</h1>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">
              {emptyMessage}
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              const isExpanded = expandedId === prescription.id;

              return (
                <div
                  key={prescription.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* HEADER */}
                  <div
                    onClick={() => toggleExpand(prescription.id)}
                    className="cursor-pointer p-6 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm border flex items-center gap-1 font-medium ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {getStatusIcon(prescription.status)}
                          {prescription.status}
                        </span>
                        <span className="text-sm text-black">
                          ID: {prescription.id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-black">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(prescription.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{prescription.items.length} items</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-black">Total</p>
                        <p className="text-2xl font-bold text-black">
                          ₹{calculateTotal(prescription.items)}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-black" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-black" />
                      )}
                    </div>
                  </div>

                  {/* EXPANDED */}
                  {isExpanded && (
                    <div className="border-t p-6 space-y-4">
                      {prescription.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-gray-100 rounded-lg"
                        >
                          <img
                            src={item.image ?? "/placeholder.png"}
                            alt={item.productName}
                            className="w-24 h-24 object-cover rounded-lg border"
                          />

                          <div className="flex-1">
                            <h4 className="font-medium text-black">
                              {item.productName}
                            </h4>
                            <p className="text-sm text-black">
                              Brand: {item.brand}
                            </p>

                            <div className="flex justify-between items-center mt-2">
                              <span className="text-lg font-bold text-black">
                                ₹{item.mrp}
                              </span>
                              <span className="text-sm text-black">
                                Qty: {item.quantity}
                              </span>
                            </div>

                            <div className="bg-blue-200 text-blue-900 mt-2 px-3 py-1 rounded-full inline-block text-sm font-medium">
                              Dosage: {item.dosage}
                            </div>
                          </div>
                        </div>
                      ))}
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
