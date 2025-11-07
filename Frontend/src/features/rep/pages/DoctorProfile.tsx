import { DoctorProfileHeader } from "../components/DoctorProfileHeader";
import { ConnectionStatus } from "../components/ConnectionStatus";
import { DoctorAbout } from "../components/DoctorAbout";
import { DoctorEducation } from "../components/DoctorEducation";
import { DoctorCertificates } from "../components/DoctorCertificates";
import { DoctorDetailsOnRepDTO } from "../dto/DoctorDetailsDTO";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const mockDoctor: DoctorDetailsOnRepDTO = {
  id: "1",
  createdAt: new Date(),
  name: "Dr. Sarah Johnson",
  phone: "+1 (555) 123-4567",
  hasOwnClinic: true,
  hospital: "City General Hospital",
  registrationId: "MED-2024-12345",
  opHours: "Mon-Fri: 9:00 AM - 5:00 PM",
  about: "Board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. Specialized in interventional cardiology and preventive care. Committed to providing personalized patient care and staying current with the latest medical advances.",
  connectionStatus: null, 
  departmentName: "Cardiology",
  territoryName: "Downtown Medical District",
  educations: [
    {
      id: "1",
      degree: "Doctor of Medicine (MD)",
      institution: "Harvard Medical School",
      year: 2005,
    },
    {
      id: "2",
      degree: "Bachelor of Science in Biology",
      institution: "Stanford University",
      year: 2001,
    },
  ],
  certificates: [
    {
      id: "1",
      name: "Board Certification in Cardiology",
      issuedBy: "American Board of Internal Medicine",
      issuedDate: "2008-06-15",
    },
    {
      id: "2",
      name: "Advanced Cardiac Life Support (ACLS)",
      issuedBy: "American Heart Association",
      issuedDate: "2023-03-20",
    },
    {
      id: "3",
      name: "Interventional Cardiology Fellowship",
      issuedBy: "Mayo Clinic",
      issuedDate: "2007-07-01",
    },
  ],
};

const DoctorProfile = () => {
  const navigate = useNavigate();

  // In a real application, you would fetch the doctor data here
  // const { id } = useParams();
  // const { data: doctor } = useQuery(...);
  
  const doctor = mockDoctor;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <DoctorProfileHeader doctor={doctor} />
        
        <ConnectionStatus
          connectionStatus={doctor.connectionStatus}
          doctorName={doctor.name}
        />

        <DoctorAbout about={doctor.about} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DoctorEducation educations={doctor.educations} />
          <DoctorCertificates certificates={doctor.certificates} />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
