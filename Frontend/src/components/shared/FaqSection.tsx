import React from "react";
import Glob from "@/assets/Glob.jpg";
const FaqSection = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "Which subscription plan is best for me?",
      answer:
        "If you are just getting started, the Basic plan is ideal. For active users looking to expand professional connections and visibility, the Professional or Premium plan offers more features and benefits.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Yes — you can upgrade, downgrade, or cancel your subscription at any time. All changes will reflect from the next billing cycle.",
    },
    {
      question: "Are the subscription plans refundable?",
      answer:
        "Subscriptions are non-refundable once activated, but you can cancel anytime to prevent future charges.",
    },
    {
      question: "Do subscription plans renew automatically?",
      answer:
        "Yes, all plans renew automatically unless canceled from your billing settings before the renewal date.",
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 px-4 py-14">
        <img
          className="max-w-sm w-full rounded-xl h-auto shadow"
          src={Glob}
          alt="Subscription FAQ"
        />

        <div>
          <p className="text-indigo-500 text-sm font-medium">FAQ's</p>
          <h1 className="text-3xl font-semibold">Frequently Asked Questions</h1>
          <p className="text-sm text-slate-500 mt-2 pb-4">
            Everything you need to know about our subscription plans, payments,
            upgrades, and account access.
          </p>

          {faqs.map((faq, index) => (
            <div
              className="border-b border-slate-200 py-4 cursor-pointer"
              key={index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">{faq.question}</h3>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    openIndex === index ? "rotate-180" : ""
                  } transition-all duration-500 ease-in-out`}
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke="#1D293D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p
                className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${
                  openIndex === index
                    ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                    : "opacity-0 max-h-0 -translate-y-2"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FaqSection;
