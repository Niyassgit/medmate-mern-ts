import LandingPageNavbar from "@/components/navbar/LandingPageNavbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShoppingCart,
  UserCheck,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";
import Footer from "./Footer";
import ReviewMarquee from "@/features/rep/components/ReviewMarquee";
import useFetchItem from "@/hooks/useFetchItem";
import { DoctorCardGuestDTO } from "@/features/shared/dto/DoctorCardGuestDTO";
import { doctorsForShow } from "@/features/shared/api/SharedApi";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

const GuestInfoPage = () => {
  const {
    data: cardsData,
    error: doctorsError,
    loading: cardsLoading,
  } = useFetchItem<DoctorCardGuestDTO[]>(doctorsForShow);

  const features = [
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description:
        "Access and manage your prescriptions online, anytime, anywhere",
    },
    {
      icon: ShoppingCart,
      title: "Order Medications",
      description: "Order prescribed medications directly from your dashboard",
    },
    {
      icon: UserCheck,
      title: "Doctor Connections",
      description: "Stay connected with your healthcare providers",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your health information is protected with industry-standard security",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description:
        "View your medical records and prescriptions at your convenience",
    },
  ];

  if (cardsLoading) return <SpinnerButton />;

  if (doctorsError)
    return <p className="text-center text-red-600">{doctorsError}</p>;
  return (
    <>
      <LandingPageNavbar />

      {/* Hero Section */}
      <section className="w-full min-h-screen bg-gradient-to-b from-[#0A1A3F] via-[#0B152F] to-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Welcome to MedMate
              <span className="block text-3xl md:text-4xl lg:text-5xl text-[#25b6c0] mt-2">
                Patient Portal
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Manage your prescriptions, order medications, and stay connected
              with your healthcare providers—all in one secure platform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link to="/register/guest">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#25b6c0] to-blue-600 text-white px-8 py-6 text-lg font-semibold hover:from-[#1fa5af] hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth/login/guest">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white px-8 py-6 text-lg font-semibold hover:bg-white hover:text-[#022b4e] transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:-translate-y-2"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#25b6c0] to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional Info Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Choose MedMate Patient Portal?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#25b6c0] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      Easy Prescription Management
                    </h3>
                    <p className="text-gray-200">
                      View all your prescriptions in one place, track medication
                      history, and never lose a prescription again.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#25b6c0] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      Convenient Ordering
                    </h3>
                    <p className="text-gray-200">
                      Order your prescribed medications online and have them
                      delivered to your doorstep.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#25b6c0] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      Secure & Private
                    </h3>
                    <p className="text-gray-200">
                      Your health data is encrypted and protected. We follow
                      strict privacy standards to keep your information safe.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#25b6c0] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      Always Accessible
                    </h3>
                    <p className="text-gray-200">
                      Access your medical information 24/7 from any device. No
                      need to visit clinics for prescription copies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ReviewMarquee cardsData={cardsData ?? []} />
          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-200 text-lg mb-6">Ready to get started?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/guest">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#25b6c0] to-blue-600 text-white px-8 py-6 text-lg font-semibold hover:from-[#1fa5af] hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Sign Up Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth/login/guest">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-6 text-lg font-semibold hover:bg-white hover:text-[#022b4e] transition-all"
                >
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GuestInfoPage;
