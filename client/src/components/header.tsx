import { Link, useLocation } from "wouter";
import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" asChild>
          <a
            data-testid="link-home"
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-3 py-2 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              atozai
            </span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" asChild>
            <a
              data-testid="link-tools"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              Browse Tools
            </a>
          </Link>
          <Link href="/categories" asChild>
            <a
              data-testid="link-categories"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/categories" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              Categories
            </a>
          </Link>
          <Link href="/agents" asChild>
            <a
              data-testid="link-agents"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/agents" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              Top AI Agents
            </a>
          </Link>
          <Link href="/contact" asChild>
            <a
              data-testid="link-contact"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/contact" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              Contact
            </a>
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          className="rounded-lg"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
