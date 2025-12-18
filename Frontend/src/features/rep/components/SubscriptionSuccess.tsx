import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { getCheckoutDetails, getSubscriptionStatus } from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { CheckoutDetailsDTO } from "../dto/CheckoutDetailsDTO";
import { SubscriptionStatusDTO } from "../dto/SubscriptionStatusDTO";

const SubscriptionSuccess: React.FC = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [checkoutDetails, setCheckoutDetails] =
    useState<CheckoutDetailsDTO | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatusDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingWebhook, setVerifyingWebhook] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        setVerifyingWebhook(false);
        return;
      }

      try {
        const details = await getCheckoutDetails(sessionId);
        setCheckoutDetails(details);
      } catch (err) {
        setError("Failed to fetch payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutDetails();
  }, [sessionId]);

  useEffect(() => {
    if (!checkoutDetails || !verifyingWebhook) return;

    const pollSubscriptionStatus = async () => {
      try {
        const status = await getSubscriptionStatus();

        if (status.isActive) {
          setSubscriptionStatus(status);
          setVerifyingWebhook(false);
        } else {
          setPollAttempts((prev) => prev + 1);
        }
      } catch (err) {
        setPollAttempts((prev) => prev + 1);
      }
    };

    if (pollAttempts < 15) {
      const timer = setTimeout(pollSubscriptionStatus, 2000);
      return () => clearTimeout(timer);
    } else {
      setVerifyingWebhook(false);
    }
  }, [checkoutDetails, verifyingWebhook, pollAttempts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinnerButton />
      </div>
    );
  }

  if (error || !checkoutDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <XCircleIcon className="text-red-500 h-16 w-16" />
            <p className="text-red-500 mt-4">
              {error || "Failed to load payment details"}
            </p>
            <Link
              to="/subscriptions"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Back to Subscriptions
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <CircleCheckIcon className="text-green-500 h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-4">
            Payment Successful
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Thank you for your payment!
          </p>
        </div>

        {/* Webhook verification status */}
        {verifyingWebhook && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <SpinnerButton />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Activating your subscription...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  This may take a few seconds
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription activated */}
        {!verifyingWebhook && subscriptionStatus?.isActive && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CircleCheckIcon className="text-green-600 dark:text-green-400 h-6 w-6" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Subscription Activated!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Valid until {formatDate(subscriptionStatus.endDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription pending (webhook not processed yet) */}
        {!verifyingWebhook && !subscriptionStatus?.isActive && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ClockIcon className="text-yellow-600 dark:text-yellow-400 h-6 w-6" />
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  Activation Pending
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Your subscription will be activated shortly. Please refresh
                  the page in a few moments.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Amount Paid:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {formatAmount(
                checkoutDetails.amount_total || 0,
                checkoutDetails.currency
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Payment Status:
            </span>
            <span className="font-medium text-green-600 dark:text-green-400 capitalize">
              {checkoutDetails.payment_status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Transaction ID:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50 text-xs">
              {sessionId?.slice(0, 20)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Date:</span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Link
            to="/rep/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/rep/subscription"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View Subscriptions
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;

function CircleCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
