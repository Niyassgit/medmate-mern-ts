import React from "react";

const HomePage1 = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <h1 className="text-3xl font-semibold text-center mx-auto text-white">
        Welcome to MedMate
      </h1>

      <p className="text-sm text-white/80 text-center mt-2 max-w-lg mx-auto">
        Your trusted platform to connect with doctors, discover prescribed
        medicines, and manage healthcare seamlessly.
      </p>

      <div className="flex items-center gap-6 h-[400px] w-full max-w-5xl mt-10 mx-auto">
        {/* Find Doctors */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&h=400&auto=format&fit=crop"
            alt="Find Doctors"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">Find Trusted Doctors</h1>
            <p className="text-sm">
              Connect with verified doctors in your territory and get expert
              medical guidance when you need it.
            </p>
          </div>
        </div>

        {/* Digital Prescriptions */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&h=400&auto=format&fit=crop"
            alt="Prescriptions"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">Digital Prescriptions</h1>
            <p className="text-sm">
              Receive, view, and manage prescriptions digitally — no paperwork,
              no confusion.
            </p>
          </div>
        </div>

        {/* Order Medicines */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src="https://1.bp.blogspot.com/-Hs1oKhhTW1E/Xoi5ubXH6kI/AAAAAAAAWPI/7cj6K9BwfssuesoC78N0ioa5iuxCky9rwCLcBGAsYHQ/s1600/bioderma-review.JPG"
            alt="Order Medicines"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-3xl">Order Medicines Easily</h1>
            <p className="text-sm">
              Place medicine orders directly from your prescription with
              transparent pricing and secure delivery.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage1;
