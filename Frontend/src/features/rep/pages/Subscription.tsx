import useFetchItem from "@/hooks/useFetchItem";
import { checkoutSubscription, subcriptionPlans } from "../api";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import ReviewMarquee from "../components/ReviewMarquee";
import { doctorsForShow } from "@/features/shared/api/SharedApi";
import { DoctorCardGuestDTO } from "@/features/shared/dto/DoctorCardGuestDTO";
import FaqSection from "@/components/shared/FaqSection";
import LayoutTextFlipDemo from "@/components/shared/LayoutTextFlipDemo";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Subscription = () => {
  const userId=useSelector((state:any)=>state.auth.user.id)
  const {
    data: plans,
    error: plansError,
    loading: plansLoading,
  } = useFetchItem<SubscriptionDTO[]>(subcriptionPlans);

  const {
    data: cardsData,
    error: doctorsError,
    loading: cardsLoading,
  } = useFetchItem<DoctorCardGuestDTO[]>(doctorsForShow);

  if (plansLoading || cardsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerButton />
      </div>
    );
  }

  const handlePurchase=async(planId:string)=>{
    if(!userId) return;
    try {
      const url=await checkoutSubscription(userId,planId);
      window.location.href=url;
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  }

  if (plansError)
    return <p className="text-center text-red-600">{plansError}</p>;
  if (doctorsError)
    return <p className="text-center text-red-600">{doctorsError}</p>;

  return (
    <div className="bg-gradient-to-b from-[#0A1A3A] to-black w-full text-white py-10">
      <div className="text-center mt-6">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Choose the plan that's right for you
        </h2>
        <p className="text-gray-300 text-sm md:text-base mt-2 max-w-xl mx-auto">
          Unlock features tailored to boost your growth and visibility — upgrade
          whenever you're ready.
        </p>
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
                  className="p-6 bg-black/20 ring ring-indigo-950 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-indigo-500 transition-all duration-400"
                >
                  <h3 className="text-xl font-bold">{plan.name}</h3>
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
                    onClick={() => handlePurchase(plan.id)}
                    className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-sm rounded-md transition-all"
                  >
                    Buy Now
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-14 mb-8">
        <FaqSection />
      </div>
    </div>
  );
};

export default Subscription;
