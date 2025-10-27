import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/tool-card";
import type { Tool } from "@shared/schema";

export default function ToolDetail() {
  const [, params] = useRoute("/tool/:slug");
  const slug = params?.slug;

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const { data: tool, isLoading } = useQuery<Tool>({
    queryKey: [`/api/tools/${slug}`],
    enabled: !!slug,
  });

  const relatedParams = new URLSearchParams();
  if (tool?.primary_category) relatedParams.append("primary_category", tool.primary_category);
  relatedParams.append("limit", "4");
  const relatedUrl = `/api/tools?${relatedParams.toString()}`;

  const { data: relatedToolsData } = useQuery<{
    tools: Tool[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: [relatedUrl],
    enabled: !!tool,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Tool not found</h2>
          <Link href="/" asChild>
            <a>
              <Button>Go Home</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const pricingColor = {
    Free: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    Paid: "bg-primary/10 text-primary border-primary/20",
    Freemium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link href="/" asChild>
          <a>
            <Button
              variant="ghost"
              className="mb-8 gap-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>
          </a>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <Card className="border-2">
              <CardHeader className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 border border-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <CardTitle className="text-3xl font-bold font-serif" data-testid="text-tool-name">
                        {tool.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`${pricingColor[tool.pricing]} shrink-0 font-semibold`}
                        data-testid="badge-pricing"
                      >
                        {tool.pricing}
                      </Badge>
                    </div>
                    <CardDescription className="text-lg" data-testid="text-short-description">
                      {tool.short_description}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tool.primary_category && (
                    <Badge variant="secondary" data-testid="badge-primary-category">
                      {tool.primary_category}
                    </Badge>
                  )}
                  {tool.secondary_category && (
                    <Badge variant="secondary" data-testid="badge-secondary-category">
                      {tool.secondary_category}
                    </Badge>
                  )}
                  {tool.platform_type && (
                    <Badge variant="outline" data-testid="badge-platform">
                      {tool.platform_type}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed break-words overflow-wrap-anywhere" data-testid="text-description">
                    {tool.description}
                  </p>
                </div>

                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full sm:w-auto"
                  data-testid="link-visit-tool"
                >
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Visit Website
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Tool Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{tool.primary_category}</span>
                </div>
                {tool.secondary_category && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Sub-Category</span>
                    <span className="font-medium">{tool.secondary_category}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-medium">{tool.platform_type}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Pricing Model</span>
                  <span className="font-medium">{tool.pricing}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-2/5">
              <CardHeader>
                <CardTitle className="text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="link-visit-sidebar"
                >
                  <Button className="w-full gap-2" size="lg">
                    Visit {tool.name}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground font-mono truncate" data-testid="text-url">
                    {tool.url}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Related Tools */}
            {relatedToolsData && relatedToolsData.tools.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Tools</CardTitle>
                  <CardDescription>More from {tool.primary_category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedToolsData.tools
                    .filter((t) => t.id !== tool.id)
                    .slice(0, 3)
                    .map((relatedTool) => (
                      <Link key={relatedTool.id} href={`/tool/${relatedTool.slug}`} asChild>
                        <a className="block hover-elevate active-elevate-2 rounded-lg p-3 border transition-all">
                          <h4 className="font-semibold mb-1 line-clamp-1">{relatedTool.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {relatedTool.short_description}
                          </p>
                        </a>
                      </Link>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
