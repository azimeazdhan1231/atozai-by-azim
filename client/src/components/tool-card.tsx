import { Link } from "wouter";
import { ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Tool } from "@shared/schema";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const pricingColor = {
    Free: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    Paid: "bg-primary/10 text-primary border-primary/20",
    Freemium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  };

  return (
    <Card
      data-testid={`card-tool-${tool.slug}`}
      className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 h-full flex flex-col"
    >
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 border border-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors break-words">
                {tool.name}
              </CardTitle>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${pricingColor[tool.pricing]} shrink-0 font-medium text-xs`}
            data-testid={`badge-pricing-${tool.pricing.toLowerCase()}`}
          >
            {tool.pricing}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm break-words overflow-hidden">
          {tool.short_description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {tool.primary_category && (
            <Badge
              variant="secondary"
              className="text-xs"
              data-testid="badge-primary-category"
            >
              {tool.primary_category}
            </Badge>
          )}
          {tool.secondary_category && (
            <Badge
              variant="secondary"
              className="text-xs"
              data-testid="badge-secondary-category"
            >
              {tool.secondary_category}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-4 border-t">
        <Link href={`/tool/${tool.slug}`}>
          <a className="flex-1">
            <Button
              variant="outline"
              className="w-full"
              data-testid="button-view-details"
            >
              View Details
            </Button>
          </a>
        </Link>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
          data-testid="link-visit-website"
        >
          <Button className="w-full gap-2">
            Visit
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
