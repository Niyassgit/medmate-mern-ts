import React, { useState, useEffect, useMemo } from "react";
import { X, Plus, Calendar, Pill, FileText, Search, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getGuests, createGuest, createPrescription, getAllReps, getRepProducts } from "../api";
import { ProductDTO } from "../dto/ProductDTO";
import { RepDTO } from "../dto/RepDTO";

interface Guest {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  isRegistered: boolean;
}

export default function PrescriptionPage() {
  const user = useSelector((state: any) => state.auth.user);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestSearchQuery, setGuestSearchQuery] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showCreateGuestModal, setShowCreateGuestModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "", territoryId: "" });
  const [creatingGuest, setCreatingGuest] = useState(false);

  const [prescription, setPrescription] = useState({
    notes: "",
    status: "PENDING",
    expiresAt: "",
    shareToken: "",
    linkExpiresAt: "",
    items: [] as Array<{ productId: string; dosage?: string; quantity: number }>,
  });

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    productName: "",
    dosage: "",
    quantity: 1,
  });

  const [reps, setReps] = useState<RepDTO[]>([]);
  const [selectedRep, setSelectedRep] = useState<RepDTO | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingReps, setLoadingReps] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    loadReps();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (guestSearchQuery.trim().length >= 2) {
        loadGuests(guestSearchQuery);
      } else if (guestSearchQuery.trim().length === 0) {
        setGuests([]);
        setShowGuestDropdown(false);
      } else {
        setGuests([]);
        setShowGuestDropdown(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [guestSearchQuery]);
 
  useEffect(() => {
    if (selectedRep) {
      loadProducts(selectedRep.id);
      setProductSearchQuery("");
    } else {
      setProducts([]);
    }
  }, [selectedRep]);

  const loadReps = async () => {
    try {
      setLoadingReps(true);
      const data = await getAllReps();
      setReps(data || []);
    } catch (error: any) {
      console.error("Error loading reps:", error);
      toast.error("Failed to load representatives");
    } finally {
      setLoadingReps(false);
    }
  };

  const loadGuests = async (search: string) => {
    try {
      setLoadingGuests(true);
      const data = await getGuests(search);
      setGuests(data || []);
      setShowGuestDropdown(true);
    } catch (error: any) {
      console.error("Error loading guests:", error);
      toast.error("Failed to load guests");
    } finally {
      setLoadingGuests(false);
    }
  };

  const loadProducts = async (repId: string) => {
    try {
      setLoadingProducts(true);
      const data = await getRepProducts(repId);
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!productSearchQuery.trim()) {
      return products;
    }
    const query = productSearchQuery.toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const brandMatch = product.brand.toLowerCase().includes(query);
      const ingredientsMatch = product.ingredients.some((ing) =>
        ing.toLowerCase().includes(query)
      );
      return nameMatch || brandMatch || ingredientsMatch;
    });
  }, [products, productSearchQuery]);

  const handleCreateGuest = async () => {
    if (!newGuest.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setCreatingGuest(true);
      const guest = await createGuest({
        name: newGuest.name,
        email: newGuest.email || undefined,
        phone: newGuest.phone || undefined,
        territoryId: newGuest.territoryId || undefined,
      });
      setSelectedGuest({
        id: guest.id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        isRegistered: guest.isRegistered,
      });
      setShowCreateGuestModal(false);
      setNewGuest({ name: "", email: "", phone: "", territoryId: "" });
      setGuestSearchQuery("");
      toast.success("Guest created successfully");
    } catch (error: any) {
      console.error("Error creating guest:", error);
      toast.error(error.response?.data?.message || "Failed to create guest");
    } finally {
      setCreatingGuest(false);
    }
  };

  const handleSelectProduct = (product: ProductDTO) => {
    setCurrentItem({
      productId: product.id,
      productName: product.name,
      dosage: "",
      quantity: 1,
    });
    setShowProductDropdown(false);
    setProductSearchQuery("");
  };

  const addItem = () => {
    if (!currentItem.productId.trim()) {
      toast.error("Please select a product");
      return;
    }

    setPrescription((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: currentItem.productId,
          dosage: currentItem.dosage,
          quantity: currentItem.quantity,
        },
      ],
    }));

    setCurrentItem({ productId: "", productName: "", dosage: "", quantity: 1 });
  };

  const removeItem = (index: number) => {
    setPrescription((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!selectedGuest) {
      toast.error("Please select a guest");
      return;
    }

    if (prescription.items.length === 0) {
      toast.error("Please add at least one medication");
      return;
    }

    try {
      setSubmitting(true);
      const prescriptionData = {
        notes: prescription.notes || undefined,
        status: prescription.status,
        expiresAt: prescription.expiresAt || undefined,
        shareToken: prescription.shareToken || undefined,
        linkExpiresAt: prescription.linkExpiresAt || undefined,
        items: prescription.items,
      };

      await createPrescription(selectedGuest.id, prescriptionData);
      toast.success("Prescription created successfully!");
      
      // Reset form
      setSelectedGuest(null);
      setGuestSearchQuery("");
      setPrescription({
        notes: "",
        status: "PENDING",
        expiresAt: "",
        shareToken: "",
        linkExpiresAt: "",
        items: [],
      });
      setCurrentItem({ productId: "", productName: "", dosage: "", quantity: 1 });
      setSelectedRep(null);
      setProducts([]);
    } catch (error: any) {
      console.error("Error creating prescription:", error);
      toast.error(error.response?.data?.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-indigo-100">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Create Prescription</h1>
          </div>

          {/* Guest Selection */}
          <div className="mb-8 bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Select Patient
            </h2>

            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={guestSearchQuery}
                    onChange={(e) => {
                      setGuestSearchQuery(e.target.value);
                      if (e.target.value.trim().length >= 2) {
                        setShowGuestDropdown(true);
                      } else if (e.target.value.trim().length === 0) {
                        setShowGuestDropdown(false);
                      } else {
                        setShowGuestDropdown(true);
                      }
                    }}
                    onFocus={() => {
                      if (guestSearchQuery.trim().length >= 2 || guests.length > 0) {
                        setShowGuestDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay to allow click on dropdown items
                      setTimeout(() => setShowGuestDropdown(false), 200);
                    }}
                    placeholder="Search for patient by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {loadingGuests && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500 w-5 h-5" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateGuestModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  New Patient
                </button>
              </div>

              {/* Guest Dropdown */}
              {showGuestDropdown && guestSearchQuery.trim().length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {loadingGuests ? (
                    <div className="p-4 text-center">
                      <Loader2 className="animate-spin text-blue-500 w-6 h-6 mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">Searching...</p>
                    </div>
                  ) : guests.length > 0 ? (
                    guests.map((guest) => (
                      <div
                        key={guest.id}
                        onClick={() => {
                          setSelectedGuest(guest);
                          setGuestSearchQuery(guest.name);
                          setShowGuestDropdown(false);
                        }}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-semibold text-gray-800">{guest.name}</div>
                        {guest.email && (
                          <div className="text-sm text-gray-600 mt-1">{guest.email}</div>
                        )}
                      </div>
                    ))
                  ) : guestSearchQuery.trim().length >= 2 ? (
                    <div className="p-6 text-center">
                      <div className="text-gray-400 mb-3">
                        <UserPlus className="w-12 h-12 mx-auto opacity-50" />
                      </div>
                      <p className="text-gray-600 font-medium mb-1">No patients found</p>
                      <p className="text-sm text-gray-500 mb-4">
                        No patients found matching "{guestSearchQuery}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateGuestModal(true);
                          setShowGuestDropdown(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Create New Patient
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">
                        Type at least 2 characters to search
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Selected Guest Display */}
              {selectedGuest && (
                <div className="mt-3 p-3 bg-blue-100 border-2 border-blue-300 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800 flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Selected Patient: {selectedGuest.name}
                      </div>
                      {selectedGuest.email && (
                        <div className="text-sm text-blue-700">{selectedGuest.email}</div>
                      )}
                      {selectedGuest.phone && (
                        <div className="text-sm text-blue-700">{selectedGuest.phone}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGuest(null);
                        setGuestSearchQuery("");
                      }}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prescription Details */}
          <div className="mb-8 bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Prescription Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={prescription.status}
                  onChange={(e) =>
                    setPrescription((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
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
                    setPrescription((prev) => ({ ...prev, expiresAt: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Token (Auto-generated for unregistered guests)
                </label>
                <input
                  type="text"
                  value={prescription.shareToken || ""}
                  onChange={(e) =>
                    setPrescription((prev) => ({ ...prev, shareToken: e.target.value }))
                  }
                  placeholder="Leave empty to auto-generate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  disabled={!selectedGuest || selectedGuest.isRegistered}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {!selectedGuest || selectedGuest.isRegistered
                    ? "Token will be auto-generated for unregistered guests"
                    : "Optional: Leave empty to auto-generate"}
                </p>
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
                    setPrescription((prev) => ({ ...prev, linkExpiresAt: e.target.value }))
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
                  setPrescription((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="General instructions, precautions, or notes for the patient..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Rep Selection for Products */}
          <div className="mb-8 bg-green-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Representative</h2>
            {loadingReps ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-green-600 w-6 h-6" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {reps.map((rep) => (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => setSelectedRep(rep)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedRep?.id === rep.id
                        ? "border-green-600 bg-green-100"
                        : "border-gray-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <div className="font-semibold text-sm">{rep.name}</div>
                    <div className="text-xs text-gray-600">{rep.company}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Medication */}
          <div className="mb-8 bg-indigo-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-600" />
              Add Medication
            </h2>

            {!selectedRep && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
                Please select a representative to view available products
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product/Medicine Name *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={currentItem.productName || productSearchQuery}
                    onChange={(e) => {
                      setProductSearchQuery(e.target.value);
                      setShowProductDropdown(true);
                      if (!e.target.value) {
                        setCurrentItem({ ...currentItem, productId: "", productName: "" });
                      }
                    }}
                    onFocus={() => {
                      if (filteredProducts.length > 0) setShowProductDropdown(true);
                    }}
                    placeholder={
                      selectedRep
                        ? "Search products from " + selectedRep.name
                        : "Select a rep first"
                    }
                    disabled={!selectedRep}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  {loadingProducts && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400 w-5 h-5" />
                  )}
                </div>

                {showProductDropdown && filteredProducts.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-800">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.brand}</div>
                        <div className="text-xs text-gray-500">
                          MRP: ₹{product.mrp} | PTR: ₹{product.ptr}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage/Instructions
                </label>
                <input
                  type="text"
                  value={currentItem.dosage}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({ ...prev, dosage: e.target.value }))
                  }
                  placeholder="e.g., 1 tablet twice daily"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
              disabled={!currentItem.productId}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                {prescription.items.map((item, index) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {product?.name || "Product"}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.dosage && <span className="mr-4">📋 {item.dosage}</span>}
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
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={!selectedGuest || prescription.items.length === 0 || submitting}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Creating...
                </>
              ) : (
                "Create Prescription"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedGuest(null);
                setGuestSearchQuery("");
                setPrescription({
                  notes: "",
                  status: "PENDING",
                  expiresAt: "",
                  shareToken: "",
                  linkExpiresAt: "",
                  items: [],
                });
                setCurrentItem({ productId: "", productName: "", dosage: "", quantity: 1 });
                setSelectedRep(null);
                setProducts([]);
              }}
              className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Create Guest Modal */}
      {showCreateGuestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create New Patient</h2>
              <button
                onClick={() => {
                  setShowCreateGuestModal(false);
                  setNewGuest({ name: "", email: "", phone: "", territoryId: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newGuest.name}
                  onChange={(e) =>
                    setNewGuest((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) =>
                    setNewGuest((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="patient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={newGuest.phone}
                  onChange={(e) =>
                    setNewGuest((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 1234567890"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateGuest}
                  disabled={creatingGuest || !newGuest.name.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creatingGuest ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Creating...
                    </>
                  ) : (
                    "Create Patient"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateGuestModal(false);
                    setNewGuest({ name: "", email: "", phone: "", territoryId: "" });
                  }}
                  className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
