import LandingPageNavbar from "@/components/navbar/LandingPageNavbar";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselDots from "@/components/shared/CarouselDots";
import { useEffect, useState } from "react";
import DoctorsSection from "./DoctorsSection";
import NetworkSection from "./NetworkSection";
import Footer from "./Footer";
import Brands from "@/features/guest/components/Brands";
import GuestBlog from "./GuestBlog";

const slides = [
  {
    title: "Connect Doctors & Medical Representatives Seamlessly",
    desc: "MedMate is the leading healthcare networking platform designed to foster efficient connections and collaborations between medical professionals and pharmaceutical representatives.",
    img: "/caro-3.png",
    cta: { label: "Get Started", to: "/auth/login" },
  },
  {
    title: "Discover Products, Posts & Updates",
    desc: "Browse rep feeds, product pages and updates from across your territory — all in one place. Stay informed about the latest medical products and industry updates.",
    img: "/caro-4.png",
    cta: { label: "Explore Feed", to: "/auth/login" },
  },
  {
    title: "Grow Your Professional Network",
    desc: "Find reps or doctors in your area, request appointments, and collaborate securely. Build meaningful professional relationships that drive healthcare innovation.",
    img: "/caro-5.png",
    cta: { label: "Find Reps", to: "/auth/login" },
  },
];

const LandingPage = () => {
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A3F] via-[#0B152F] to-black">
      <LandingPageNavbar />

      {/* Hero Section - About MedMate */}
      <section className="w-full py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#25b6c0] via-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
              Welcome to MedMate
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              The premier healthcare networking platform connecting doctors and medical representatives
            </p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              MedMate revolutionizes how healthcare professionals connect, collaborate, and grow. 
              Whether you're a doctor seeking the latest medical products, a medical representative 
              looking to expand your network, or a patient needing prescription-based medication purchases, 
              MedMate provides the tools and platform you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to="/auth/login"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#25b6c0] to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out overflow-hidden text-lg"
              >
                <span className="relative z-10">Get Started Now</span>
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#0c666d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                to="/auth/login"
                className="inline-flex items-center px-8 py-4 border-2 border-[#25b6c0] text-[#25b6c0] font-semibold rounded-xl hover:bg-[#25b6c0] hover:text-white transition-all duration-300 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-[#25b6c0] to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional Networking</h3>
              <p className="text-white/70">
                Connect with verified doctors and medical representatives in your territory. Build meaningful professional relationships.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Product Discovery</h3>
              <p className="text-white/70">
                Explore the latest medical products, read detailed information, and stay updated with industry news and updates.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Prescription-Based Purchasing</h3>
              <p className="text-white/70">
                Patients can easily purchase medications through prescriptions issued by doctors. A seamless, secure, and trusted process for prescription fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width / full-height hero carousel */}
      <section className="w-full flex justify-center items-center py-12 relative overflow-hidden">
        <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-3 border border-white/20 shadow-2xl w-[90%]">
          <Carousel
            className="w-full h-full relative"
            setApi={setEmblaApi}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
              }),
            ]}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {slides.map((s, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 w-full h-full overflow-hidden">
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#25b6c0]/5 via-transparent to-purple-500/5 pointer-events-none" />

                    {/* Floating decorative elements */}
                    <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-[#25b6c0]/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000" />

                    {/* Left: Enhanced text + CTA section */}
                    <div className="lg:w-1/2 w-full max-w-2xl text-center lg:text-left z-10 space-y-4 px-4 lg:px-0">
                      {/* Main heading with gradient text */}
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#25b6c0] via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight tracking-tight">
                        {s.title}
                      </h1>

                      {/* Description with better spacing */}
                      <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                        {s.desc}
                      </p>

                      {/* Enhanced CTA section - Single button to prevent overflow */}
                      <div className="pt-2">
                        <Link
                          to={s.cta.to}
                          className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#25b6c0] to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out overflow-hidden"
                        >
                          <span className="relative z-10">{s.cta.label}</span>
                          <svg
                            className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#0c666d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </div>
                    </div>

                    {/* Right: Enhanced image section */}
                    <div className="lg:w-1/2 w-full flex justify-center relative z-10">
                      <div className="relative group">
                        {/* Glowing background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#25b6c0]/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 transform group-hover:scale-110" />

                        {/* Image container with glassmorphism */}
                        <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-3 border border-white/20 shadow-2xl">
                          <img
                            src={s.img}
                            alt={s.title}
                            className="w-full h-[50vh] md:h-[65vh] object-cover rounded-2xl shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                            draggable={false}
                          />

                          {/* Floating info card */}
                          <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-sm font-medium text-gray-700">
                                Live Platform
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300 delay-300" />
                        <div className="absolute -bottom-2 -right-8 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300 delay-500" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 shadow-md bg-gray-300" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 shadow-md bg-gray-300" />
          </Carousel>

          <CarouselDots
            slidesCount={slides.length}
            selectedIndex={selectedIndex}
            scrollTo={(i: number) => emblaApi && emblaApi.scrollTo(i)}
          />
        </div>
      </section>

      <DoctorsSection />
      <NetworkSection />
      <GuestBlog />
      <div className="m-10">
        <Brands />
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
