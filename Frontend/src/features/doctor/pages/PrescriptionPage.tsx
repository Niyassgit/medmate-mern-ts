import React, { useState } from "react";
import { X, Plus, Calendar, Pill, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function PrescriptionPage() {
  const [prescription, setPrescription] = useState({
    notes: "",
    status: "ACTIVE",
    expiresAt: "",
    shareToken: "",
    linkExpiresAt: "",
    items: [],
  });

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    dosage: "",
    quantity: 1,
  });

  const addItem = () => {
    if (!currentItem.productId.trim()) {
      alert("Please enter a product name");
      return;
    }

    setPrescription((prev) => ({
      ...prev,
      items: [...prev.items, { ...currentItem }],
    }));

    setCurrentItem({ productId: "", dosage: "", quantity: 1 });
  };

  const removeItem = (index) => {
    setPrescription((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (prescription.items.length === 0) {
      alert("Please add at least one medication");
      return;
    }

    const prescriptionData = {
      ...prescription,
      expiresAt: prescription.expiresAt
        ? new Date(prescription.expiresAt)
        : undefined,
      linkExpiresAt: prescription.linkExpiresAt
        ? new Date(prescription.linkExpiresAt)
        : undefined,
    };

    console.log("Prescription Data:", prescriptionData);
    toast.success("Prescription created successfully! Check console for details.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-indigo-100">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Create Prescription
            </h1>
          </div>

          <div>
            {/* Prescription Details */}
            <div className="mb-8 bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Prescription Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={prescription.status}
                    onChange={(e) =>
                      setPrescription((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Expires At
                  </label>
                  <input
                    type="date"
                    value={prescription.expiresAt}
                    onChange={(e) =>
                      setPrescription((prev) => ({
                        ...prev,
                        expiresAt: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Token (Optional)
                  </label>
                  <input
                    type="text"
                    value={prescription.shareToken}
                    onChange={(e) =>
                      setPrescription((prev) => ({
                        ...prev,
                        shareToken: e.target.value,
                      }))
                    }
                    placeholder="e.g., ABC123XYZ"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Link Expires At (Optional)
                  </label>
                  <input
                    type="date"
                    value={prescription.linkExpiresAt}
                    onChange={(e) =>
                      setPrescription((prev) => ({
                        ...prev,
                        linkExpiresAt: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Notes
                </label>
                <textarea
                  value={prescription.notes}
                  onChange={(e) =>
                    setPrescription((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="General instructions, precautions, or notes for the patient..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Add Medication */}
            <div className="mb-8 bg-indigo-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600" />
                Add Medication
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Medicine Name *
                  </label>
                  <input
                    type="text"
                    value={currentItem.productId}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        productId: e.target.value,
                      }))
                    }
                    placeholder="e.g., Amoxicillin 500mg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage/Instructions
                  </label>
                  <input
                    type="text"
                    value={currentItem.dosage}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        dosage: e.target.value,
                      }))
                    }
                    placeholder="e.g., 1 tablet twice daily"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={currentItem.quantity}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="mt-4 flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add to Prescription
              </button>
            </div>

            {/* Medication List */}
            {prescription.items.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Prescribed Medications
                </h2>
                <div className="space-y-3">
                  {prescription.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {item.productId}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.dosage && (
                            <span className="mr-4">📋 {item.dosage}</span>
                          )}
                          <span>📦 Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Create Prescription
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrescription({
                    notes: "",
                    status: "ACTIVE",
                    expiresAt: "",
                    shareToken: "",
                    linkExpiresAt: "",
                    items: [],
                  });
                  setCurrentItem({ productId: "", dosage: "", quantity: 1 });
                }}
                className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
