import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, BriefcaseMedical, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const featuresRep = [
  "Post and promote products",
  "Territory-based doctor discovery",
  "Build strong professional connections",
  "Chat & schedule appointments",
];

const featuresDoctor = [
  "Explore rep posts & product updates",
  "Easy connection & communication",
  "Personalized feed from your territory",
  "Secure chat & appointment requests",
];

const NetworkSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#185891] via-[#14497a] to-[#103b64]">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Grow with <span className="text-healthcare-blue-light">MedMate</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            MedMate bridges the gap between doctors and medical representatives —
            empowering seamless connections, collaboration, and professional growth.
          </p>
        </div>

        {/* Two roles section */}
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Medical Representative Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-transparent border border-gray-200 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="bg-healthcare-blue-light w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <BriefcaseMedical className="w-8 h-8 text-healthcare-blue" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">
                  For Medical Representatives
                </h3>
                <p className="text-muted-foreground mb-8">
                  Showcase your products, connect with doctors in your territory,
                  and grow your professional network with ease.
                </p>

                <ul className="w-full space-y-3 mb-8">
                  {featuresRep.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-foreground text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 text-healthcare-blue shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full  text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg rounded-lg"
                >
                  <Link to="/register/rep">Register as Representative</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Doctor Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-transparent border border-gray-200 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="bg-healthcare-blue-light w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Stethoscope className="w-8 h-8 text-healthcare-blue" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">
                  For Doctors
                </h3>
                <p className="text-muted-foreground mb-8">
                  Connect with trusted medical representatives, explore new
                  products, and collaborate to improve patient care.
                </p>

                <ul className="w-full space-y-3 mb-8">
                  {featuresDoctor.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-foreground text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 text-healthcare-blue shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 border-healthcare-blue text-healthcare-blue hover:bg-healthcare-blue hover:text-white transition-all duration-200 shadow-sm hover:shadow-md rounded-lg"
                >
                  <Link to="/register/doctor">Register as Doctor</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16">
          <p className="text-white/80 text-lg mb-6">
            Trusted by <span className="font-semibold text-white">10,000+</span>{" "}
            healthcare professionals worldwide
          </p>
          <div className="flex justify-center space-x-4">
            <span className="w-3 h-3 bg-healthcare-blue rounded-full"></span>
            <span className="w-3 h-3 bg-white/40 rounded-full"></span>
            <span className="w-3 h-3 bg-white/40 rounded-full"></span>
            <span className="w-3 h-3 bg-white/40 rounded-full"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;
