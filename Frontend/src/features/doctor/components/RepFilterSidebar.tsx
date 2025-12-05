import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Territory {
  id: string;
  name: string;
}

interface RepFilterSidebarProps {
  company: string;
  setCompany: (value: string) => void;
  selectedTerritories: string[];
  setSelectedTerritories: (value: string[]) => void;
  territories: Territory[];
  companies: string[];
  applyFilters: () => void;
  resetFilters: () => void;
}

export default function RepFilterSidebar({
  company,
  setCompany,
  selectedTerritories,
  setSelectedTerritories,
  territories,
  companies,
  applyFilters,
  resetFilters,
}: RepFilterSidebarProps) {
  const toggleTerritory = (territoryId: string) => {
    setSelectedTerritories(
      selectedTerritories.includes(territoryId)
        ? selectedTerritories.filter((id) => id !== territoryId)
        : [...selectedTerritories, territoryId]
    );
  };

  return (
    <aside className="w-full lg:w-64 bg-card rounded-lg border p-6 h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Company Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Company</label>
          <Select value={company || undefined} onValueChange={(value) => setCompany(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent className="bg-popover max-h-[200px] overflow-y-auto">
              {companies.map((comp) => (
                <SelectItem key={comp} value={comp}>
                  {comp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {company && (
            <button
              onClick={() => setCompany("")}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear company filter
            </button>
          )}
        </div>

        {/* Territory Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Location (Territories)
          </label>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {territories.map((territory) => (
              <label
                key={territory.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedTerritories.includes(territory.id)}
                  onChange={() => toggleTerritory(territory.id)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">{territory.name}</span>
              </label>
            ))}
          </div>
          {selectedTerritories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedTerritories.map((id) => {
                const territory = territories.find((t) => t.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    {territory?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleTerritory(id)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4 border-t">
          <Button
            onClick={applyFilters}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Apply Filters
          </Button>
          <Button
            onClick={resetFilters}
            variant="outline"
            className="w-full"
          >
            Reset
          </Button>
        </div>
      </div>
    </aside>
  );
}

