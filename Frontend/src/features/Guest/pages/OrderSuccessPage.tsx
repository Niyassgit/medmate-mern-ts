import { CheckCircle, Home } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        // Optionally verify session_id with backend if needed
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your order. We have received your payment and will process your prescription shortly.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/guest/prescriptions")}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        View My Prescriptions
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccessPage;
