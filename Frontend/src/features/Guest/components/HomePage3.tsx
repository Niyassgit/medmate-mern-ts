import React from "react";

const HomePage3 = () => {
  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="absolute -z-50 size-[400px] -top-10 -left-20 aspect-square rounded-full bg-indigo-500/30 blur-3xl"></div>
        <p className="text-slate-800 text-lg text-left max-w-3xl">
          PrebuiltUI helps you build faster by transforming your design vision
          into fully functional, production-ready UI components.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10">
          <div className="md:col-span-2">
            <img
              alt="features showcase"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-4.png"
            />
          </div>
          <div className="md:col-span-1">
            <img
              alt="features showcase"
              className="hover:-translate-y-0.5 transition duration-300"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-3.png"
            />
            <h3 className="text-[24px]/7.5 text-slate-800 font-medium mt-6">
              Better design with highest revenue and profits{" "}
            </h3>
            <p className="text-slate-600 mt-2">
              PrebuiltUI empowers you to build beautifully and scale
              effortlessly.
            </p>
            <a
              href="https://prebuiltui.com"
              className="group flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700 transition"
            >
              Learn more about the product
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right size-5 group-hover:translate-x-0.5 transition duration-300"
                aria-hidden="true"
              >
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage3;
