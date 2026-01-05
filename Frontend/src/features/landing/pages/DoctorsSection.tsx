import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { doctorsForShow } from "@/features/shared/api/SharedApi";
import doctor1 from "@/assets/doctor-1.jpg";

interface DoctorPreview {
  id: string;
  name: string;
  hospitalName: string;
  profileImage: string | null;
  about: string;
  createdAt: Date;
  dob: Date | null;
  departmentName: string | null;
  territoryName: string | null;
}

interface DisplayDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  experience: string;
  hospitalName: string;
  departmentName: string | null;
  territoryName: string | null;
}

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState<DisplayDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched.current) return;
    
    const fetchDoctors = async () => {
      hasFetched.current = true;
      try {
        setLoading(true);
        setError(null);
        const data: DoctorPreview[] = await doctorsForShow();
        
        // Filter doctors: must have profileImage and about (not null or empty)
        const filteredDoctors = data.filter(
          (doctor) => {
            const hasImage = doctor.profileImage !== null && doctor.profileImage !== "";
            return hasImage;
          }
        );
        
        // Sort by dob (already sorted by backend, but ensure it's sorted)
        const sortedDoctors = [...filteredDoctors].sort((a, b) => {
          if (!a.dob && !b.dob) return 0;
          if (!a.dob) return 1;
          if (!b.dob) return -1;
          return new Date(a.dob).getTime() - new Date(b.dob).getTime();
        });
        
        // Limit to only 3 doctors
        const limitedDoctors = sortedDoctors.slice(0, 3);
        
        const mappedDoctors: DisplayDoctor[] = limitedDoctors.map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.departmentName || "General Physician", 
          rating: 4.8, 
          image: doctor.profileImage!, 
          experience: "10+ years",
          hospitalName: doctor.hospitalName,
          departmentName: doctor.departmentName,
          territoryName: doctor.territoryName,
        }));
        
        setDoctors(mappedDoctors);
      } catch (err) {
        setError("Failed to load doctors");
        hasFetched.current = false; // Reset on error so it can retry
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Meet Our Popular Doctors
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Connect with our experienced healthcare professionals who are dedicated 
            to providing you with the best medical care.
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white">Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white">No doctors available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="bg-gradient-card border-0 shadow-card hover:shadow-soft transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover shadow-soft"
                        onError={(e) => {
                          // Fallback to default image if profile image fails to load
                          (e.target as HTMLImageElement).src = doctor1;
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-healthcare-blue text-white text-xs px-2 py-1 rounded-full">
                        {doctor.experience}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-healthcare-blue font-medium mb-3">
                      {doctor.specialty}
                    </p>
                    
                    {doctor.departmentName && (
                      <p className="text-sm text-white/70 mb-1">
                        Department: {doctor.departmentName}
                      </p>
                    )}
                    {doctor.territoryName && (
                      <p className="text-sm text-white/70 mb-3">
                        Territory: {doctor.territoryName}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-1 mb-6">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{doctor.rating}</span>
                      <span className="text-sm text-white/70">(200+ reviews)</span>
                    </div>
        
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="outline"
                className="border-healthcare-blue text-healthcare-blue hover:bg-healthcare-blue hover:text-white transition-all duration-200"
              >
                View All Doctors
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;