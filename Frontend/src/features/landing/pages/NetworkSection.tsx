import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, BriefcaseMedical } from "lucide-react";
import { Link } from "react-router-dom";

const NetworkSection = () => {
  return (
    <section className="py-20 bg-healthcare-gray-light/30 bg-[#185891]">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Grow with MedMate
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            MedMate bridges the gap between doctors and medical representatives,
            enabling seamless connections, collaboration, and growth.
          </p>
        </div>

        {/* Two roles section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Medical Representative Section */}
          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="bg-healthcare-blue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BriefcaseMedical className="w-8 h-8 text-healthcare-blue" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                For Medical Representatives
              </h3>
              <p className="text-muted-foreground mb-6">
                Showcase your products, connect with doctors in your territory,
                and grow your professional network with ease.
              </p>

              <ul className="text-left space-y-2 mb-8 text-foreground">
                <li>• Post and promote products</li>
                <li>• Territory-based doctor discovery</li>
                <li>• Build strong professional connections</li>
                <li>• Chat & schedule appointments</li>
              </ul>

              <Button
                asChild
                className="w-full bg-gradient-to-r from-healthcare-blue to-blue-600 text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg rounded-lg"
              >
                <Link to="/register/rep">Register as Representative</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Doctor Section */}
          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="bg-healthcare-blue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-8 h-8 text-healthcare-blue" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                For Doctors
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect with trusted medical representatives, explore new
                products, and collaborate to improve patient care.
              </p>

              <ul className="text-left space-y-2 mb-8 text-foreground">
                <li>• Explore rep posts & product updates</li>
                <li>• Easy connection & communication</li>
                <li>• Personalized feed from your territory</li>
                <li>• Secure chat & appointment requests</li>
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
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Trusted by 10,000+ healthcare professionals worldwide
          </p>
          <div className="flex justify-center space-x-8 opacity-60">
            <div className="w-3 h-3 bg-healthcare-blue rounded-full"></div>
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <div className="w-3 h-3 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;
