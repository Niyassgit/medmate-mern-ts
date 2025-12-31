import useFetchItem from "@/hooks/useFetchItem";
import {
  checkoutSubscription,
  upgradeSubscription,
  subcriptionPlans,
  getSubscriptionStatus,
} from "../api";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import ReviewMarquee from "../components/ReviewMarquee";
import { doctorsForShow } from "@/features/shared/api/SharedApi";
import { DoctorCardGuestDTO } from "@/features/shared/dto/DoctorCardGuestDTO";
import FaqSection from "@/components/shared/FaqSection";
import LayoutTextFlipDemo from "@/components/shared/LayoutTextFlipDemo";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AnimeButton from "@/components/shared/AnimeButton";
import { getSubscriptionHistory } from "../api";
import { useState } from "react";
import { SubHistoryDTO } from "../dto/SubHistoryDTO";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Subscription = () => {
  const userId = useSelector((state: any) => state.auth.user.id);
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<SubHistoryDTO[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Upgrade modal state
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [prorationDetails, setProrationDetails] = useState<{
    originalPrice: number;
    creditAmount: number;
    finalPrice: number;
    daysRemaining: number;
  } | null>(null);

  const {
    data: plans,
    error: plansError,
    loading: plansLoading,
  } = useFetchItem<SubscriptionDTO[]>(subcriptionPlans);

  const { data: subscriptionStatus, loading: statusLoading } =
    useFetchItem<any>(getSubscriptionStatus);

  const {
    data: cardsData,
    error: doctorsError,
    loading: cardsLoading,
  } = useFetchItem<DoctorCardGuestDTO[]>(doctorsForShow);

  const handleViewHistory = async () => {
    setOpen(true);
    setHistoryLoading(true);

    try {
      const result = await getSubscriptionHistory();
      setHistory(result);
    } catch (error) {
      toast.error("Failed to load subscription history");
    } finally {
      setHistoryLoading(false);
    }
  };

  if (plansLoading || cardsLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerButton />
      </div>
    );
  }

  const handlePurchase = async (planId: string) => {
    if (!userId) return;
    try {
      const url = await checkoutSubscription(userId, planId);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong, please try again.");
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!userId) return;
    setUpgradeLoading(true);
    try {
      const response = await upgradeSubscription(planId);
      setCheckoutUrl(response.checkoutUrl);
      setProrationDetails(response.prorationDetails);
      setUpgradeModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upgrade failed. Please try again.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleConfirmUpgrade = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const handleCancelUpgrade = () => {
    setUpgradeModalOpen(false);
    setCheckoutUrl(null);
    setProrationDetails(null);
  };

  if (plansError)
    return <p className="text-center text-red-600">{plansError}</p>;
  if (doctorsError)
    return <p className="text-center text-red-600">{doctorsError}</p>;

  const isSubscribed =
    subscriptionStatus?.isActive &&
    subscriptionStatus?.endDate &&
    new Date(subscriptionStatus.endDate) > new Date();

  const expiryDate = isSubscribed
    ? new Date(subscriptionStatus.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-gradient-to-b from-[#0A1A3A] to-black w-full text-white py-10">
      <div className="text-center mt-6">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {isSubscribed
            ? "Upgrade Your Plan"
            : "Choose the plan that's right for you"}
        </h2>
        <p className="text-gray-300 text-sm md:text-base mt-2 max-w-xl mx-auto">
          {isSubscribed
            ? `You are currently on an active plan expiring on ${expiryDate}. Upgrading now extends your plan validity.`
            : "Unlock features tailored to boost your growth and visibility — upgrade whenever you're ready."}
        </p>
        <div className="flex justify-end w-full max-w-5xl mx-auto px-4 mt-6 relative">
          <AnimeButton
            label={historyLoading ? "Loading..." : "View History"}
            onClick={handleViewHistory}
          />

          {/* Dropdown below button */}
          {open && history && (
            <div className="absolute top-full right-0 mt-2 w-[600px] max-w-[90vw] z-50">
              <div className="bg-gray-900/95 rounded-lg p-6 border border-white/20 backdrop-blur-sm shadow-2xl min-h-[100vh] max-h-[100vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Subscription History</h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {history.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No subscription history found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {history.map((item: SubHistoryDTO) => {
                      const plan = plans?.find((p) => p.id === item.planId);
                      const startDate = new Date(item.startDate);
                      const endDate = new Date(item.endDate);
                      const isActive =
                        new Date() >= startDate && new Date() <= endDate;

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg bg-black/40 border border-gray-700 hover:border-indigo-500/50 transition-all"
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold text-white">
                                {plan?.name || "Unknown Plan"}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  isActive
                                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                    : item.status === "completed"
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                    : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                                }`}
                              >
                                {isActive ? "Active" : item.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-400">Amount: </span>
                                <span className="text-white font-medium">
                                  {item.currency.toUpperCase()} {item.amount}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  Plan Credits:{" "}
                                </span>
                                <span className="text-white font-medium">
                                  {plan?.tenure || "N/A"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  Start Date:{" "}
                                </span>
                                <span className="text-white text-xs">
                                  {startDate.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  End Date:{" "}
                                </span>
                                <span className="text-white text-xs">
                                  {endDate.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              {item.invoiceId && (
                                <div className="col-span-2">
                                  <span className="text-gray-400">
                                    Invoice ID:{" "}
                                  </span>
                                  <span className="text-white font-mono text-xs">
                                    {item.invoiceId.slice(0, 20)}...
                                  </span>
                                </div>
                              )}
                              <div className="col-span-2">
                                <span className="text-gray-400">
                                  Purchase Date:{" "}
                                </span>
                                <span className="text-white text-xs">
                                  {new Date(item.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-14 mb-8">
        <ReviewMarquee cardsData={cardsData ?? []} />
      </div>
      <div className="mt-14 mb-8">
        <LayoutTextFlipDemo />
      </div>

      <div className="w-full max-w-5xl mx-auto z-20 max-md:px-4">
        <div className="pt-14 py-4 px-4 ">
          <div className="grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4">
            {plans &&
              plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-6 bg-black/20 ring ring-indigo-950 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-indigo-500 transition-all duration-400 ${
                    isSubscribed && subscriptionStatus?.planId === plan.id
                      ? "ring-2 ring-green-500 bg-green-900/10"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {isSubscribed && subscriptionStatus?.planId === plan.id && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/50">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <div className="my-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-300">
                      {" "}
                      / {plan.tenure} credits
                    </span>
                  </div>

                  <p className="text-gray-300 mb-6">{plan.description}</p>

                  <ul className="space-y-1.5 mb-6 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-indigo-300 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      if (isSubscribed) {
                        handleUpgrade(plan.id);
                      } else {
                        handlePurchase(plan.id);
                      }
                    }}
                    disabled={
                      (isSubscribed && subscriptionStatus?.planId === plan.id) ||
                      upgradeLoading
                    }
                    className={`w-full py-2 px-4 text-sm rounded-md transition-all ${
                      isSubscribed && subscriptionStatus?.planId === plan.id
                        ? "bg-gray-600 cursor-not-allowed opacity-50"
                        : isSubscribed
                        ? "bg-green-600 hover:bg-green-700 active:scale-95 disabled:opacity-50"
                        : "bg-indigo-500 hover:bg-indigo-600 active:scale-95 disabled:opacity-50"
                    }`}
                  >
                    {upgradeLoading
                      ? "Processing..."
                      : isSubscribed && subscriptionStatus?.planId === plan.id
                      ? "Current Plan"
                      : isSubscribed
                      ? "Upgrade"
                      : "Buy Now"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-14 mb-8">
        <FaqSection />
      </div>

      {/* Upgrade Confirmation Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={handleCancelUpgrade}>
        <DialogContent className="bg-[#0A1A3A] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <h2 className="text-2xl font-bold text-white">Confirm Upgrade</h2>
          </DialogHeader>
          
          {prorationDetails && (
            <div className="space-y-4 py-4">
              <p className="text-gray-300">
                You're upgrading your subscription. Here's the breakdown:
              </p>
              
              <div className="bg-black/40 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Plan Price:</span>
                  <span className="text-white font-semibold">₹{prorationDetails.originalPrice}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    Credit ({prorationDetails.daysRemaining} days remaining):
                  </span>
                  <span className="text-green-400 font-semibold">
                    -₹{prorationDetails.creditAmount.toFixed(2)}
                  </span>
                </div>
                
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">Final Amount:</span>
                    <span className="text-indigo-400 font-bold text-xl">
                      ₹{prorationDetails.finalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                Your premium plan will start immediately and expire after expiry of current plan.
              </p>
            </div>
          )}
          
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={handleCancelUpgrade}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpgrade}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={upgradeLoading || !checkoutUrl}
            >
              {upgradeLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscription;
