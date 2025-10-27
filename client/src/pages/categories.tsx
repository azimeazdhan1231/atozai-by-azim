import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Folder } from "lucide-react";
import type { Categories } from "@shared/schema";

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useQuery<Categories>({
    queryKey: ["/api/categories"],
  });

  const { data: toolsData, isLoading: toolsLoading } = useQuery<{
    tools: any[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["/api/tools?limit=10000"],
  });

  console.log("Categories data:", categories);
  console.log("Tools data:", toolsData);
  console.log("Error:", error);

  const getCategoryCount = (category: string) => {
    if (!toolsData) return 0;
    return toolsData.tools.filter((tool) => tool.primary_category === category).length;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Error loading categories. Please try again later.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-primary/5 to-chart-2/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container relative mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Browse by</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
                Category
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore AI tools organized by their primary function and use case
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        {isLoading || toolsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !categories?.primary || categories.primary.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No categories available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.primary
              .filter((cat) => getCategoryCount(cat) > 0)
              .sort((a, b) => getCategoryCount(b) - getCategoryCount(a))
              .map((category) => {
                const count = getCategoryCount(category);
                const slug = category.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link key={category} href={`/?primary_category=${encodeURIComponent(category)}`} asChild>
                    <a data-testid={`link-category-${slug}`}>
                      <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200 hover-elevate active-elevate-2">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 border border-primary/10">
                            <Folder className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base line-clamp-2">{category}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" data-testid={`badge-count-${slug}`}>
                            {count} {count === 1 ? "tool" : "tools"}
                          </Badge>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
