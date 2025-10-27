import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { filterParamsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tools with filtering and pagination
  app.get("/api/tools", async (req, res) => {
    try {
      const filters = filterParamsSchema.parse({
        search: req.query.search || "",
        pricing: req.query.pricing
          ? Array.isArray(req.query.pricing)
            ? req.query.pricing
            : [req.query.pricing]
          : undefined,
        primary_category: req.query.primary_category || undefined,
        secondary_category: req.query.secondary_category || undefined,
        platform_type: req.query.platform_type || undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 24,
      });

      const result = await storage.getAllTools(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });

  // Get single tool by slug
  app.get("/api/tools/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tool = await storage.getToolBySlug(slug);

      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }

      res.json(tool);
    } catch (error) {
      console.error("Error fetching tool:", error);
      res.status(500).json({ error: "Failed to fetch tool" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      console.log("Categories endpoint called, returning:", categories);
      res.json(categories);
    } catch (error) {
      console.error("Error in /api/categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Search tools
  app.get("/api/search", async (req, res) => {
    try {
      const query = (req.query.q as string) || "";
      const results = await storage.searchTools(query);
      res.json({ tools: results });
    } catch (error) {
      console.error("Error searching tools:", error);
      res.status(500).json({ error: "Failed to search tools" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}