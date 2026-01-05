import React from "react";

const GuestBlog = () => {
  return (
    <>
      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto pt-10">
        <h2 className="text-3xl font-semibold text-gray-800">
          Guest Experiences
        </h2>
        <p className="mt-2 text-gray-500">
          See how guest users experienced purchasing and exploring products on
          MedMate.
        </p>
      </div>

      {/* Guest Cards */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-20 m-10">
        {/* Guest 1 */}
        <div className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
          <div className="flex flex-col items-center px-5 py-4 relative">
            <img
              className="h-24 w-24 absolute -top-14 rounded-full"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
              alt="Donald Jackman"
            />
            <div className="pt-8 text-center">
              <h1 className="text-lg font-medium text-gray-800">
                Donald Jackman
              </h1>
              <p className="text-gray-800/80">Guest Buyer</p>
            </div>
          </div>
          <p className="text-gray-500 px-6 text-center">
            I purchased products through MedMate and the experience was
            absolutely stunning. The delivery was on time and the overall
            process felt smooth and trustworthy.
          </p>
          <div className="flex justify-center pt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 22 20">
                  <path
                    d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                    fill="#FF532E"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Guest 2 */}
        <div className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
          <div className="flex flex-col items-center px-5 py-4 relative">
            <img
              className="h-24 w-24 absolute -top-14 rounded-full"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
              alt="Richard Nelson"
            />
            <div className="pt-8 text-center">
              <h1 className="text-lg font-medium text-gray-800">
                Richard Nelson
              </h1>
              <p className="text-gray-800/80">Guest User</p>
            </div>
          </div>
          <p className="text-gray-500 px-6 text-center">
            As a guest user, browsing products and connecting with medical reps
            was very intuitive. Everything was well organized and easy to
            understand.
          </p>
          <div className="flex justify-center pt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 22 20">
                  <path
                    d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                    fill="#FF532E"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Guest 3 */}
        <div className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
          <div className="flex flex-col items-center px-5 py-4 relative">
            <img
              className="h-24 w-24 absolute -top-14 rounded-full"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
              alt="James Washington"
            />
            <div className="pt-8 text-center">
              <h1 className="text-lg font-medium text-gray-800">
                James Washington
              </h1>
              <p className="text-gray-800/80">Healthcare Professional</p>
            </div>
          </div>
          <p className="text-gray-500 px-6 text-center">
            MedMate provides a reliable way to explore medical products. Even as
            a guest, the experience felt premium, fast, and very professional.
          </p>
          <div className="flex justify-center pt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 22 20">
                  <path
                    d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                    fill="#FF532E"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestBlog;
