import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    rating: 4.9,
    image: doctor1,
    experience: "15+ years"
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    specialty: "General Physician",
    rating: 4.8,
    image: doctor2,
    experience: "12+ years"
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    specialty: "Dermatologist",
    rating: 4.9,
    image: doctor3,
    experience: "10+ years"
  }
];

const DoctorsSection = () => {
  return (
    <section className="py-20 bg-healthcare-gray-light/30 bg-[#185891]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Meet Our Popular Doctors
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Connect with our experienced healthcare professionals who are dedicated 
            to providing you with the best medical care.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="bg-gradient-card border-0 shadow-card hover:shadow-soft transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover shadow-soft"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-healthcare-blue text-white text-xs px-2 py-1 rounded-full">
                    {doctor.experience}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {doctor.name}
                </h3>
                <p className="text-healthcare-blue font-medium mb-3">
                  {doctor.specialty}
                </p>
                
                <div className="flex items-center justify-center gap-1 mb-6">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-sm text-muted-foreground">(200+ reviews)</span>
                </div>
                
                <Button 
                  className="w-full bg-gradient-primary text-white hover:opacity-90 transition-all duration-200"
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline"
            className="border-healthcare-blue text-healthcare-blue hover:bg-healthcare-blue-light transition-all duration-200"
          >
            View All Doctors
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;