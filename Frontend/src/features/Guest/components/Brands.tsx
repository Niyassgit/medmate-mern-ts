import React from "react";

const Brands = () => {
  const companiesLogo = [
    { name: "Framer", logo: "https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" },
    { name: "Huawei", logo: "https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" },
    { name: "Instagram", logo: "https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" },
    { name: "Microsoft", logo: "https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" },
    { name: "Walmart", logo: "https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" },
  ];

  return (
    <>
      <style>
        {`
          .marquee-inner {
            animation: marqueeScroll 15s linear infinite;
            display: flex;
            white-space: nowrap;
          }

          @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <h3 className="text-base text-center text-slate-300 pb-10 font-medium">
        Trusted by leading brands —
      </h3>

      <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
        
        {/* Left Gradient Fade */}
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />

        {/* Logo Marquee */}
        <div className="marquee-inner max-w-5xl mx-auto">
          {[...companiesLogo, ...companiesLogo].map((company, index) => (
            <img
              key={index}
              className="mx-10 h-10 opacity-80 hover:opacity-100 transition"
              src={company.logo}
              alt={company.name}
            />
          ))}
        </div>

        {/* Right Gradient Fade */}
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />
      </div>
    </>
  );
};

export default Brands;
