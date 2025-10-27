import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterX } from "lucide-react";
import type { FilterParams } from "@shared/schema";

interface FilterPanelProps {
  filters: FilterParams;
  onFilterChange: (filters: Partial<FilterParams>) => void;
  categories: string[];
  onClearFilters: () => void;
}

export function FilterPanel({ filters, onFilterChange, categories, onClearFilters }: FilterPanelProps) {
  const pricingOptions: Array<"Free" | "Paid" | "Freemium"> = ["Free", "Paid", "Freemium"];

  const activeFiltersCount = 
    (filters.pricing?.length || 0) + 
    (filters.primary_category ? 1 : 0);

  return (
    <Card className="sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Filters</CardTitle>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-xs gap-1"
            data-testid="button-clear-filters"
          >
            <FilterX className="h-3 w-3" />
            Clear
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Pricing</Label>
            <div className="space-y-2">
              {pricingOptions.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`pricing-${option}`}
                    checked={filters.pricing?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const current = filters.pricing || [];
                      onFilterChange({
                        pricing: checked
                          ? [...current, option]
                          : current.filter((p) => p !== option),
                      });
                    }}
                    data-testid={`checkbox-pricing-${option.toLowerCase()}`}
                  />
                  <Label
                    htmlFor={`pricing-${option}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Categories</Label>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.primary_category === category}
                      onCheckedChange={(checked) => {
                        onFilterChange({
                          primary_category: checked ? category : undefined,
                        });
                      }}
                      data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer flex-1 line-clamp-1"
                      title={category}
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}