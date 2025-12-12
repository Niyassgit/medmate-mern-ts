import React, { useEffect, useState } from "react";
import {
  CreditCard,
  MapPin,
  Plus,
  Check,
  Package,
  Clock,
  AlertCircle,
  Loader2,
  Trash,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { PrescriptionDTO } from "@/components/Dto/Prescriptions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAddress, createAddress, deleteAddress } from "../api";
import toast from "react-hot-toast";
import { AddressDTO } from "../dto/Address";
import {
  AddressSchema,
  AddressSchemaDTO,
} from "../schemas/CreateAddressSchema";
import { AddressType } from "@/types/AddressType";
import { AddressCreateDTO } from "../dto/AddressCreateDTO";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prescription: PrescriptionDTO = location.state;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressSchemaDTO>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      country: "India",
      type: AddressType.HOME,
    },
  });

  useEffect(() => {
    if (!prescription) {
      navigate("/guest/prescriptions");
      return;
    }
    fetchAddresses();
  }, [prescription, navigate]);

  const fetchAddresses = async () => {
    try {
      const data = await getAddress();
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAddress = async (data: AddressCreateDTO) => {
    try {
      const res = await createAddress(data);
      toast.success("Address added successfully");

      setAddresses([...addresses, res]);
      setSelectedAddressId(res.id);

      setShowAddressForm(false);
      reset();
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const handlePayment = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    toast.success("Processing payment...");
  };

  const handleDeleteAddress = (e: React.MouseEvent, addressId: string) => {
    e.stopPropagation();
    setAddressToDelete(addressId);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      await deleteAddress(addressToDelete);
      setAddresses(addresses.filter((addr) => addr.id !== addressToDelete));
      if (selectedAddressId === addressToDelete) {
        setSelectedAddressId(null);
      }
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Failed to delete address", error);
      toast.error("Failed to delete address");
    } finally {
      setConfirmOpen(false);
      setAddressToDelete(null);
    }
  };

  if (!prescription) return null;

  const subtotal = prescription.items.reduce(
    (sum, item) => sum + item.mrp * item.quantity,
    0
  );
  const deliveryCharge = 50;
  const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your prescription order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prescription Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Prescription Note
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {prescription.notes}
                </p>
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Valid until{" "}
                  {prescription.expiresAt
                    ? new Date(prescription.expiresAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-8 text-gray-500">
                    No addresses found. Please add one.
                  </div>
                ) : (
                  !showAddressForm &&
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {selectedAddressId === address.id && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <MapPin
                          className={`w-5 h-5 mt-1 ${
                            selectedAddressId === address.id
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {address.fullName}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full capitalize">
                                {address.type}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            📱 {address.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteAddress(e, address.id)}
                        className="absolute bottom-4 right-4 p-2 hover:bg-red-50 rounded-full group transition-colors z-10"
                        title="Delete Address"
                      >
                        <Trash className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  ))
                )}

                {showAddressForm ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Add New Address
                    </h3>
                    <form
                      onSubmit={handleSubmit(onSubmitAddress)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-black mb-1">
                            Full Name
                          </label>
                          <input
                            {...register("fullName")}
                            placeholder="Full Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-black mb-1">
                            Street Address / Flat No
                          </label>
                          <input
                            {...register("street")}
                            placeholder="Street Address / Flat No"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                          {errors.street && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.street.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            City
                          </label>
                          <input
                            {...register("city")}
                            placeholder="City"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.city.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            State
                          </label>
                          <input
                            {...register("state")}
                            placeholder="State"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.state.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Pincode
                          </label>
                          <input
                            {...register("zipCode")}
                            placeholder="Pincode"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                          {errors.zipCode && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Phone Number
                          </label>
                          <input
                            {...register("phone")}
                            placeholder="Phone Number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type
                          </label>
                          <select
                            {...register("type")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                          >
                            <option value="HOME">Home</option>
                            <option value="WORK">Work</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                        >
                          {isSubmitting ? "Saving..." : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            reset();
                          }}
                          className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Address
                  </button>
                )}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          paymentMethod === "card"
                            ? "bg-purple-500"
                            : "bg-gray-200"
                        }`}
                      >
                        <CreditCard
                          className={`w-5 h-5 ${
                            paymentMethod === "card"
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Credit/Debit Card
                        </p>
                        <p className="text-sm text-gray-500">
                          Powered by Stripe
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          paymentMethod === "cod"
                            ? "bg-purple-500"
                            : "bg-gray-200"
                        }`}
                      >
                        <Package
                          className={`w-5 h-5 ${
                            paymentMethod === "cod"
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-500">
                          Pay when you receive
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {prescription.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-gray-100"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {item.dosage}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{item.mrp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium text-gray-900">
                      ₹{deliveryCharge}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-green-600">
                      ₹{total}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all shadow-lg shadow-green-500/30 mt-4"
                >
                  {paymentMethod === "card"
                    ? "Proceed to Payment"
                    : "Place Order"}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmButtonClassName="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default CheckoutPage;
