import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NetworkFilterSideBar = () => {
   return (
    <aside className="w-full lg:w-64 bg-card rounded-lg border p-6 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Filters</h2>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2">
          <Button size="sm" variant="default">
            Doctor
          </Button>
          <Button size="sm" variant="outline" className="bg-purple text-purple-foreground hover:bg-purple/90">
            Rep
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">OP Time</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any Time" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="any">Any Time</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any Location" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="any">Any Location</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Class</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="classA" defaultChecked />
              <label htmlFor="classA" className="text-sm text-foreground cursor-pointer">
                Class A Doctors
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="classB" defaultChecked />
              <label htmlFor="classB" className="text-sm text-foreground cursor-pointer">
                Class B Doctors
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Age Range</label>
          <div className="px-2">
            <Slider defaultValue={[25, 70]} max={100} min={0} step={1} className="mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>25</span>
              <span>70</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full">Apply Filters</Button>
          <button className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  )
}

export default NetworkFilterSideBar
