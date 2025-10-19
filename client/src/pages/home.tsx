import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search-bar";
import { FilterPanel } from "@/components/filter-panel";
import { ToolCard } from "@/components/tool-card";
import { SkeletonGrid } from "@/components/skeleton-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Tool, FilterParams, Categories } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    pricing: [],
    page: 1,
    limit: 24,
  });
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.pricing && filters.pricing.length > 0) {
    filters.pricing.forEach((p) => queryParams.append("pricing", p));
  }
  if (filters.primary_category) queryParams.append("primary_category", filters.primary_category);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  
  const queryString = queryParams.toString();
  const toolsUrl = `/api/tools${queryString ? `?${queryString}` : ""}`;

  const { data: toolsData, isLoading: toolsLoading } = useQuery<{
    tools: Tool[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: [toolsUrl],
  });

  const { data: categories } = useQuery<Categories>({
    queryKey: ["/api/categories"],
  });

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      pricing: [],
      page: 1,
      limit: 24,
    });
    setSearchQuery("");
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const stats = useMemo(() => {
    const total = toolsData?.total || 2840;
    const free = Math.floor(total * 0.42);
    const paid = Math.floor(total * 0.31);
    const freemium = total - free - paid;
    return { total, free, paid, freemium };
  }, [toolsData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-primary/5 to-chart-2/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container relative mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2"></span>
              </span>
              <span className="text-muted-foreground">
                {stats.total.toLocaleString()}+ AI tools and growing
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
                Discover AI Tools
              </span>
              <br />
              <span className="text-foreground">From A to Z</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The ultimate directory of AI tools and resources. Find the perfect solution
              for your needs from our curated collection.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-chart-2">{stats.free.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Free Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.paid.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Paid Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-chart-3">{stats.freemium.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Freemium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Tools Section */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search 2,800+ AI tools..."
          />
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  data-testid="button-mobile-filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {(filters.pricing?.length || 0) + (filters.primary_category ? 1 : 0) > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {(filters.pricing?.length || 0) + (filters.primary_category ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  categories={categories?.primary || []}
                  onClearFilters={handleClearFilters}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Filters Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories?.primary || []}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Tools Grid */}
          <main>
            {toolsLoading ? (
              <SkeletonGrid count={24} />
            ) : toolsData && toolsData.tools.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {((filters.page || 1) - 1) * (filters.limit || 24) + 1}-
                    {Math.min((filters.page || 1) * (filters.limit || 24), toolsData.total)} of{" "}
                    {toolsData.total.toLocaleString()} tools
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {toolsData.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>

                {/* Pagination */}
                {toolsData.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                      disabled={(filters.page || 1) <= 1}
                      data-testid="button-previous-page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, toolsData.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={(filters.page || 1) === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => setFilters((prev) => ({ ...prev, page }))}
                            data-testid={`button-page-${page}`}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      })}
                      {toolsData.totalPages > 5 && (
                        <>
                          <span className="px-2 text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setFilters((prev) => ({ ...prev, page: toolsData.totalPages }))}
                            className="w-10"
                          >
                            {toolsData.totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(toolsData.totalPages, (prev.page || 1) + 1) }))}
                      disabled={(filters.page || 1) >= toolsData.totalPages}
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState onReset={handleClearFilters} />
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
