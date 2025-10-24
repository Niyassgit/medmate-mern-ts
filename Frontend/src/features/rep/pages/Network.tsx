import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import NetworkFilterSideBar from "../components/NetworkFilterSideBar";
import NetworkDoctorCard from "../components/NetworkDoctorCard";
import { useCallback } from "react";
import { DoctorCardDTO } from "../dto/DoctorCardDTO";
import useFetchItem from "@/hooks/useFetchItem";
import { useSelector } from "react-redux";
import { networks } from "../api";

const Network = () => {
  const id = useSelector((state: any) => state.auth.user?.id);
  const fetchDoctors = useCallback(() => {
    if (!id) Promise.resolve(null);
    return networks(id);
  }, [id]);

  const {
    data: doctors,
    loading,
    error,
  } = useFetchItem<DoctorCardDTO[]>(fetchDoctors);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Available Doctors
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors by name or specialty..."
                className="pl-10"
              />
            </div>

            <Select defaultValue="name">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="specialty">Specialty</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <NetworkFilterSideBar />

          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {doctors &&
                doctors.map((doctor) => (
                  <NetworkDoctorCard
                    key={doctor.id}
                    name={doctor.name}
                    image={doctor.profileImage}
                    institution={doctor.institution}
                    location={doctor.territory}
                    specialty={doctor.speciality}
                    schedule={doctor.schedule}
                  />
                ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Network;
