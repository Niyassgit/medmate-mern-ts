import LandingPageNavbar from "@/components/navbar/LandingPageNavbar";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselDots from "@/components/CarouselDots";
import { useEffect, useState } from "react";
import DoctorsSection from "./DoctorsSection";
import NetworkSection from "./NetworkSection";
import Footer from "./Footer";

const slides = [
  {
    title: "Connect Doctors & Medical Representatives Seamlessly",
    desc: "Medmate is the leading healthcare networking platform designed to foster efficient connections and collaborations between medical professionals and pharmaceutical representatives.",
    img: "/caro-3.png",
    cta: { label: "Login", to: "/auth/login" },
  },
  {
    title: "Discover Products, Posts & Updates",
    desc: "Browse rep feeds, product pages and updates from across your territory — all in one place.",
    img: "/caro-4.png",
    cta: { label: "Explore Feed", to: "/feed" },
  },
  {
    title: "Grow Your Professional Network",
    desc: "Find reps or doctors in your area, request appointments, and collaborate securely.",
    img: "/caro-5.png",
    cta: { label: "Find Reps", to: "/reps" },
  },
];

const LandingPage = () => {
  const [emblaApi, setEmblaApi] = useState<any>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);
    onSelect();

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <>
      <LandingPageNavbar />

      {/* Full-width / full-height hero carousel */}
      <section
        className="w-full flex justify-center items-center py-12 relative overflow-hidden"
        style={{
          backgroundImage: "url('/bg-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
      
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
      <Footer/>

    </>
  );
};

export default LandingPage;
