import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ExternalLink, CheckCircle2 } from "lucide-react";
import type { AgentTool } from "@shared/schema";

export default function TopAIAgents() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Top 15 Free AI Agents & Tools 2025 | AtoZAI";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover the top 15 free AI agent tools and platforms for 2025. From no-code builders to developer frameworks, find the perfect AI agent solution for your needs."
      );
    }

    // Add Open Graph tags
    const ogTags = [
      { property: "og:title", content: "Top 15 Free AI Agents & Tools 2025 | AtoZAI" },
      { property: "og:description", content: "Discover the top 15 free AI agent tools and platforms for 2025. From no-code builders to developer frameworks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Top 15 Free AI Agents & Tools 2025 | AtoZAI" },
      { name: "twitter:description", content: "Discover the top 15 free AI agent tools and platforms for 2025." },
    ];

    ogTags.forEach(({ property, name, content }) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        if (property) tag.setAttribute("property", property);
        if (name) tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, []);

  const { data: agents, isLoading } = useQuery<AgentTool[]>({
    queryKey: ["/api/agents"],
  });

  const categoryColors: Record<string, string> = {
    "No-Code Builder": "bg-chart-2/10 text-chart-2 border-chart-2/20",
    "Marketing Automation": "bg-primary/10 text-primary border-primary/20",
    "Enterprise": "bg-chart-4/10 text-chart-4 border-chart-4/20",
    "Developer Tools": "bg-chart-1/10 text-chart-1 border-chart-1/20",
    "Developer Framework": "bg-chart-5/10 text-chart-5 border-chart-5/20",
    "Coding Assistant": "bg-chart-3/10 text-chart-3 border-chart-3/20",
    "Workflow Automation": "bg-primary/10 text-primary border-primary/20",
    "Business Automation": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-primary/5 to-chart-2/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container relative mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Badge 
              variant="outline" 
              className="mb-4 border-primary/20 bg-primary/10 text-primary hover-elevate"
              data-testid="badge-curated"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Curated Collection 2025
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Top 15 Free</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
                AI Agents & Tools
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the most powerful free AI agent platforms and tools for 2025. From no-code builders to advanced developer frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(15)].map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="gap-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : agents && agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card 
                key={agent.id} 
                className="flex flex-col hover-elevate transition-all"
                data-testid={`card-agent-${agent.id}`}
              >
                <CardHeader className="gap-2 space-y-0 pb-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <CardTitle className="text-xl font-bold">
                      {agent.name}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={categoryColors[agent.category] || "bg-muted/10 text-muted-foreground border-muted/20"}
                      data-testid={`badge-category-${agent.id}`}
                    >
                      {agent.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {agent.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-semibold text-foreground">Key Features:</h4>
                    <ul className="space-y-1">
                      {agent.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-chart-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-2 border-t">
                    <div className="bg-chart-2/5 border border-chart-2/20 rounded-md p-3">
                      <p className="text-xs font-semibold text-chart-2 mb-1">Free Tier</p>
                      <p className="text-sm text-foreground">{agent.freeTier}</p>
                    </div>

                    <Button 
                      asChild
                      className="w-full min-h-10"
                      data-testid={`button-visit-${agent.id}`}
                    >
                      <a 
                        href={agent.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Visit Website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No AI agents found.</p>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="font-serif text-3xl font-bold text-center">
              Why These AI Agents?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Genuinely Free</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All tools listed offer free tiers or are completely open-source with no hidden costs.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Updated for 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Curated list of the latest and most powerful AI agent platforms available today.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Diverse Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    From no-code builders to developer frameworks, covering all skill levels and needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
