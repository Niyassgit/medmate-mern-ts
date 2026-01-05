import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSidebarProps {
  opTime: string;
  setOpTime: (val: string) => void;
  ageRange: number[];
  setAgeRange: (val: number[]) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const NetworkFilterSideBar = ({
  opTime,
  setOpTime,
  ageRange,
  setAgeRange,
  applyFilters,
  resetFilters,
}: FilterSidebarProps) => {
  return (
    <aside className="w-full lg:w-64 bg-card rounded-lg border p-6 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* OP Time */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">OP Time</label>
          <Select value={opTime} onValueChange={setOpTime}>
            <SelectTrigger>
              <SelectValue placeholder="Any Time" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="any">Any Time</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Age Range
          </label>
          <div className="px-2">
            <Slider
              value={ageRange}
              onValueChange={setAgeRange}
              max={100}
              min={18}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{ageRange[0]}</span>
              <span>{ageRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
          <button
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NetworkFilterSideBar;
