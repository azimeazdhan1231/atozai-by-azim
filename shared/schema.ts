import { z } from "zod";

// Tool schema for AI directory
export const toolSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  url: z.string().url(),
  short_description: z.string(),
  description: z.string(),
  pricing: z.enum(['Free', 'Paid', 'Freemium']),
  primary_category: z.string(),
  secondary_category: z.string(),
  platform_type: z.string(),
});

export type Tool = z.infer<typeof toolSchema>;

// Filter parameters for searching/filtering tools
export const filterParamsSchema = z.object({
  search: z.string().optional(),
  pricing: z.array(z.enum(['Free', 'Paid', 'Freemium'])).optional(),
  primary_category: z.string().optional(),
  secondary_category: z.string().optional(),
  platform_type: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(24),
});

export type FilterParams = z.infer<typeof filterParamsSchema>;

// Categories response
export const categoriesSchema = z.object({
  primary: z.array(z.string()),
  secondary: z.array(z.string()),
  pricing: z.array(z.string()),
});

export type Categories = z.infer<typeof categoriesSchema>;

// API response types
export interface ToolsResponse {
  tools: Tool[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface CategoryInfo {
  name: string;
  count: number;
  slug: string;
}
