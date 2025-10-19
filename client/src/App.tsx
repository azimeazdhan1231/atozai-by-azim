import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import Home from "@/pages/home";
import ToolDetail from "@/pages/tool-detail";
import CategoriesPage from "@/pages/categories";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tool/:slug" component={ToolDetail} />
          <Route path="/categories" component={CategoriesPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="border-t bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                atozai
              </span>
              <span className="text-sm text-muted-foreground">
                © 2025 All rights reserved
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Discover AI tools from A to Z
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
