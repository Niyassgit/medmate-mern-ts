import { XCircle, RefreshCcw } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OrderCancelPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-600 mb-8">
                    Your payment was cancelled or failed. No charges were made. You can try again or choose a different payment method.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </button>

                    <button
                        onClick={() => navigate("/guest/prescriptions")}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Back to Prescriptions
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderCancelPage;
