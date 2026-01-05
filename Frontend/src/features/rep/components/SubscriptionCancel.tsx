import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import paymentCancel from "@/assets/paymentCancel.png"

const SubscriptionCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <img src={paymentCancel} alt="payment-cancel" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-4">
            Payment Cancelled
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Your payment was not completed.  
            No money has been deducted.
          </p>
        </div>

        <div className="flex flex-col space-y-2 mt-6">
          <Link
            to="/rep/subscription"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Try Again
          </Link>

          <Link
            to="/rep/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionCancel;
