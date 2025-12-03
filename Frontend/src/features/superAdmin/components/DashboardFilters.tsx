import { useState } from 'react';
import { Calendar, X, Filter, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  startDate?: string;
  endDate?: string;
  year?: string;
}

export function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isApplying, setIsApplying] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const handleApplyFilters = () => {
    setIsApplying(true);
    
    // Simulate loading effect
    setTimeout(() => {
      onFilterChange({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        year: selectedYear,
      });
      setIsApplying(false);
      setJustApplied(true);
      
      // Remove success indicator after 2 seconds
      setTimeout(() => setJustApplied(false), 2000);
    }, 300);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedYear(currentYear.toString());
    onFilterChange({
      year: currentYear.toString(),
    });
  };

  const hasActiveFilters = startDate || endDate;

  return (
    <Card className="border-border bg-card mb-6 transition-all duration-300 hover:shadow-lg">
      <CardContent className="pt-6">
        {/* Header with Icon */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Data Filters</h3>
          {justApplied && (
            <span className="ml-auto inline-flex items-center gap-1 text-sm text-success animate-fade-in">
              <Check className="h-4 w-4" />
              Applied!
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-end gap-4">
          {/* Date Range Section */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Date Range
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm 
                           transition-all duration-200
                           hover:border-primary/50
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Start Date"
                  disabled={isApplying}
                />
              </div>
              <span className="text-muted-foreground font-medium">→</span>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm 
                           transition-all duration-200
                           hover:border-primary/50
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="End Date"
                  disabled={isApplying}
                />
              </div>
            </div>
          </div>

          {/* Year Selection for Growth Chart */}
          <div className="min-w-[150px]">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Growth Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={isApplying}
              className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm 
                       transition-all duration-200
                       hover:border-primary/50
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                       disabled:opacity-50 disabled:cursor-not-allowed
                       cursor-pointer"
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              disabled={isApplying}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 
                       transition-all duration-200 
                       hover:scale-105 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       shadow-md hover:shadow-lg"
            >
              {isApplying ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Applying...
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                disabled={isApplying}
                variant="outline"
                className="border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 px-4 py-2
                         transition-all duration-200
                         hover:scale-105 active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-primary flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                Active filters:
              </span>
              {startDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                               bg-primary/10 text-primary border border-primary/30
                               transition-all duration-200 hover:bg-primary/20 hover:scale-105">
                  From: {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                               bg-primary/10 text-primary border border-primary/30
                               transition-all duration-200 hover:bg-primary/20 hover:scale-105">
                  To: {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

