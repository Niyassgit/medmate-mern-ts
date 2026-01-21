import { Star, Search, Loader2 } from "lucide-react";
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
import { useState, useEffect } from "react";
import { DoctorCardDTO } from "../dto/DoctorCardDTO";
import { useAppSelector } from "@/app/hooks";
import { networks } from "../api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import noDataImg from "@/assets/hand-drawn-no-data-illustration.png";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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

  const [page, setPage] = useState(1);
  const limit = 9;

  const [allDoctors, setAllDoctors] = useState<DoctorCardDTO[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    setPage(1);
    setAllDoctors([]);
    setHasMore(true);
  }, [debouncedSearch, appliedFilters]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await networks(
          id,
          debouncedSearch,
          appliedFilters,
          page,
          limit
        );
 
        const newData = response.data || []; 
  

        setAllDoctors((prev) => (page === 1 ? newData : [...prev, ...newData]));
        setHasMore(newData.length === limit);

      } catch (err) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, debouncedSearch, appliedFilters, page]);

  // Load More Trigger
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [isIntersecting, hasMore, loading]);


  const applyFilters = () => {
    setAppliedFilters({ opTime, ageRange });
  };

  const resetFilters = () => {
    setOpTime("any");
    setAgeRange([25, 70]);
    setSearch("");
    setAppliedFilters({ opTime: "any", ageRange: [25, 70] });
  };

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
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {allDoctors.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allDoctors.map((doctor) => (
                    <NetworkDoctorCard
                      key={doctor.id}
                      {...doctor}
                      location={doctor.territory}
                      image={doctor.profileImage}
                    />
                  ))}
                </div>
                {/* Loader Trigger */}
                {hasMore && (
                  <div
                    ref={loadMoreRef}
                    className="flex justify-center p-4 mt-4"
                  >
                    {loading && <Loader2 className="w-6 h-6 animate-spin" />}
                  </div>
                )}
              </>
            ) : (
              !loading && (
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
              )
            )}
            {/* Initial loading state (page 1) */}
            {loading && allDoctors.length === 0 && (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Network;
