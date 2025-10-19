import { SearchX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  icon?: "search" | "sparkles";
}

export function EmptyState({
  title = "No tools found",
  description = "Try adjusting your filters or search query",
  onReset,
  icon = "search",
}: EmptyStateProps) {
  const Icon = icon === "search" ? SearchX : Sparkles;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {onReset && (
        <Button onClick={onReset} data-testid="button-reset-filters">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
