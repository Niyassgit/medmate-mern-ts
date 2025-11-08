import { DoctorProfileHeader } from "../components/DoctorProfileHeader";
import { ConnectionStatus } from "../components/ConnectionStatus";
import { DoctorAbout } from "../components/DoctorAbout";
import { DoctorEducation } from "../components/DoctorEducation";
import { DoctorCertificates } from "../components/DoctorCertificates";
import { DoctorDetailsOnRepDTO } from "../dto/DoctorDetailsDTO";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import useFetchItem from "@/hooks/useFetchItem";
import { useCallback } from "react";
import { doctorDetails } from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();

  const fetchDoctor = useCallback(async () => {
    if (!doctorId) throw new Error("No rep Id found");

    const res = await doctorDetails(doctorId);
    return res.data as DoctorDetailsOnRepDTO;
  }, [doctorId]);
  const { data:doctor, error, loading } =
    useFetchItem<DoctorDetailsOnRepDTO>(fetchDoctor);

  if (loading) return <SpinnerButton />;
  if (error || !doctor)
    return (
      <p className="text-center text-red-500 py-10">Failed to load data</p>
    );

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
