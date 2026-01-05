import React from "react";

const Brands = () => {
  const companiesLogo = [
    {
      name: "cipla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/be/Cipla_logo.svg",
    },
    {
      name: "GlenMark",
      logo: "https://cdn.brandfetch.io/idBvXUg5o_/w/2635/h/1469/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    },
    {
      name: "Bioderma",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Bioderma_logo.svg",
    },
    {
      name: "Brinton",
      logo: "https://cdn.brandfetch.io/idrAh-6iY8/w/624/h/216/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    },
    {
      name: "Torrent",
      logo: "https://cdn.brandfetch.io/idOCNRZoOq/w/136/h/42/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    },
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
