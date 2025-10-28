import { Link, useLocation } from "wouter";
import { Moon, Sun, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Browse Tools", testId: "link-tools" },
    { href: "/categories", label: "Categories", testId: "link-categories" },
    { href: "/agents", label: "Top AI Agents", testId: "link-agents" },
    { href: "/contact", label: "Contact", testId: "link-contact" },
  ];

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} asChild>
              <a
                data-testid={item.testId}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Desktop Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          className="rounded-lg hidden md:flex"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle-mobile"
            className="rounded-lg"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-mobile-menu"
                className="rounded-lg"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    atozai
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} asChild>
                    <a
                      onClick={() => setIsOpen(false)}
                      data-testid={`${item.testId}-mobile`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors hover-elevate active-elevate-2 ${
                        location === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
