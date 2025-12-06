import { useCallback, useState, useEffect } from "react";
import Networks from "../components/Networks";
import RepFilterSidebar from "../components/RepFilterSidebar";
import { RepCardDetailsDTO } from "../dto/RepCardDetailsDTO";
import { useSelector } from "react-redux";
import { getNetworks } from "../api";
import useFetchItem from "@/hooks/useFetchItem";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Search } from "lucide-react";
import { api } from "@/services/api";
import { getTerritories } from "@/features/shared/api/SharedApi";

interface Territory {
  id: string;
  name: string;
}

export default function NetworkPage() {
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const id = useSelector((state: any) => state.auth.user?.id);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [company, setCompany] = useState("");
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<{
    company?: string;
    territories?: string[];
  }>({});

  const [territories, setTerritories] = useState<Territory[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);

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

  const fetchReps = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return getNetworks(id, debouncedSearch, appliedFilters);
  }, [id, debouncedSearch, appliedFilters]);

  const {
    data: reps,
    loading,
    error,
  } = useFetchItem<RepCardDetailsDTO[] | null>(fetchReps);

  useEffect(() => {
    if (reps && reps.length > 0) {
      const uniqueCompanies = Array.from(
        new Set(reps.map((rep) => rep.companyName))
      ).sort();
      setCompanies(uniqueCompanies);
    }
  }, [reps]);

  const applyFilters = () => {
    setAppliedFilters({
      company: company || undefined,
      territories: selectedTerritories.length > 0 ? selectedTerritories : undefined,
    });
  };

  const resetFilters = () => {
    setCompany("");
    setSelectedTerritories([]);
    setSearch("");
    setAppliedFilters({});
  };

  if (loading) return <SpinnerButton />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Explore Medical Reps
              </h1>
              <p className="text-muted-foreground mt-1">
                Find and connect with medical representatives in your department
              </p>
            </div>
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
            {reps && reps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reps.map((user) => (
                  <Networks
                    key={user.id}
                    user={user}
                    onConnect={handleConnect}
                    isConnected={connections.has(user.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reps found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
