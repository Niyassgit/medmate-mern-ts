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
import { useCallback, useState } from "react";
import { DoctorCardDTO } from "../dto/DoctorCardDTO";
import useFetchItem from "@/hooks/useFetchItem";
import { useAppSelector } from "@/app/hooks";
import { networks } from "../api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Spinner } from "@/components/ui/spinner";
import noDataImg from "@/assets/hand-drawn-no-data-illustration.png";

const Network = () => {
  const id = useAppSelector((state) => state.auth.user?.id);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [opTime, setOpTime] = useState("any");
  const [ageRange, setAgeRange] = useState<number[]>([25, 70]);

  const [appliedFilters, setAppliedFilters] = useState({
    opTime: "any",
    ageRange: [25, 70],
  });

  const fetchDoctors = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return networks(id, debouncedSearch, appliedFilters);
  }, [id, debouncedSearch, appliedFilters]);

  const { data: doctors, loading, error} =
    useFetchItem<DoctorCardDTO[]>(fetchDoctors);

  const applyFilters = () => {
    setAppliedFilters({ opTime, ageRange });

  };

  const resetFilters = () => {
    setOpTime("any");
    setAgeRange([25, 70]);
    setSearch("");
    setAppliedFilters({ opTime: "any", ageRange: [25, 70] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          <NetworkFilterSideBar
            opTime={opTime}
            setOpTime={setOpTime}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />

          <main className="flex-1">
            {doctors && doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <NetworkDoctorCard
                    key={doctor.id}
                    {...doctor}
                    location={doctor.territory}
                    image={doctor.profileImage}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <img
                  src={noDataImg}
                  alt="No doctors found"
                  className="w-68 h-68 mb-4 opacity-80"
                />
                <h2 className="text-lg font-semibold text-foreground">
                  No doctors found
                </h2>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Network;
