import { useState, useEffect } from "react";
import Networks from "../components/Networks";
import RepFilterSidebar from "../components/RepFilterSidebar";
import { RepCardDetailsDTO } from "../dto/RepCardDetailsDTO";
import { useAppSelector } from "@/app/hooks";
import { getNetworks } from "../api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Loader2, Search } from "lucide-react";
import { getTerritories } from "@/features/shared/api/SharedApi";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface Territory {
  id: string;
  name: string;
}

export default function NetworkPage() {
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const id = useAppSelector((state) => state.auth.user?.id);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [company, setCompany] = useState("");
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<{
    company?: string;
    territories?: string[];
  }>({});
  const [page, setPage] = useState(1);
  const limit = 9;

  const [territories, setTerritories] = useState<Territory[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);

  const [allReps, setAllReps] = useState<RepCardDetailsDTO[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        const response = await getTerritories();
        setTerritories(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch territories:", error);
      }
    };
    fetchTerritories();
  }, []);


  useEffect(() => {
    setPage(1);
    setAllReps([]);
    setHasMore(true);
  }, [debouncedSearch, appliedFilters]);


  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getNetworks(
          id,
          debouncedSearch,
          appliedFilters,
          page,
          limit
        );



        const newData = response.data || [];

        setAllReps((prev) => (page === 1 ? newData : [...prev, ...newData]));
        setHasMore(newData.length === limit);

        // Extract companies
        if (newData.length > 0) {
          const uniqueCompanies = Array.from(
            new Set(newData.map((rep: RepCardDetailsDTO) => rep.companyName))
          ).sort() as string[];
          setCompanies((prev) => {
            const newComps = new Set([...prev, ...uniqueCompanies]);
            return Array.from(newComps).sort();
          });
        }

      } catch (err) {
        setError("Failed to fetch medical reps");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, debouncedSearch, appliedFilters, page]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [isIntersecting, hasMore, loading]);


  const applyFilters = () => {
    setAppliedFilters({
      company: company || undefined,
      territories:
        selectedTerritories.length > 0 ? selectedTerritories : undefined,
    });
  };

  const resetFilters = () => {
    setCompany("");
    setSelectedTerritories([]);
    setSearch("");
    setAppliedFilters({});
  };

  const handleConnect = (userId: string, status: string | null) => {
    setConnections((prev) => {
      const newSet = new Set(prev);
      if (status === "ACCEPTED") {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Explore Medical Reps
            </h1>
            <p className="text-muted-foreground mt-1">
              Find and connect with medical representatives in your department
            </p>
          </div>
          <div className="mt-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, department, or company..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <RepFilterSidebar
            company={company}
            setCompany={setCompany}
            selectedTerritories={selectedTerritories}
            setSelectedTerritories={setSelectedTerritories}
            territories={territories}
            companies={companies}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />

          {/* Reps Grid */}
          <div className="flex-1">
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {allReps.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allReps.map((user) => (
                    <Networks
                      key={user.id}
                      user={user}
                      onConnect={handleConnect}
                      isConnected={connections.has(user.id)}
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
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No reps found matching your criteria
                  </p>
                </div>
              )
            )}
            {/* Initial loading state (page 1) */}
            {loading && allReps.length === 0 && (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

