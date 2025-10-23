import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import toolsData from "../../server/data/tools.json";
import categoriesData from "../../server/data/categories.json";

interface Tool {
  id: number;
  name: string;
  slug: string;
  url: string;
  short_description: string;
  description: string;
  pricing: 'Free' | 'Paid' | 'Freemium';
  primary_category: string;
  secondary_category: string;
  platform_type: string;
}

const tools: Tool[] = toolsData as Tool[];

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/tools', '');
  const url = new URL(event.rawUrl);
  const searchParams = url.searchParams;

  try {
    // GET /api/tools - List all tools with filtering and pagination
    if (path === '' || path === '/') {
      const search = searchParams.get('search')?.toLowerCase() || '';
      const pricingFilter = searchParams.getAll('pricing');
      const primaryCategory = searchParams.get('primary_category');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '24');

      let filtered = tools;

      // Apply search filter
      if (search) {
        filtered = filtered.filter(tool =>
          tool.name.toLowerCase().includes(search) ||
          tool.short_description.toLowerCase().includes(search) ||
          tool.description.toLowerCase().includes(search) ||
          tool.primary_category.toLowerCase().includes(search) ||
          tool.secondary_category.toLowerCase().includes(search)
        );
      }

      // Apply pricing filter
      if (pricingFilter.length > 0) {
        filtered = filtered.filter(tool => pricingFilter.includes(tool.pricing));
      }

      // Apply category filter
      if (primaryCategory) {
        filtered = filtered.filter(tool => tool.primary_category === primaryCategory);
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedTools = filtered.slice(start, end);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          tools: paginatedTools,
          total,
          page,
          totalPages,
          hasMore: page < totalPages,
        }),
      };
    }

    // GET /api/categories - Get all categories
    if (path === '/categories') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(categoriesData),
      };
    }

    // GET /api/tools/:slug - Get single tool by slug
    const slugMatch = path.match(/^\/([^/]+)$/);
    if (slugMatch) {
      const slug = slugMatch[1];
      const tool = tools.find(t => t.slug === slug);

      if (!tool) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Tool not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(tool),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
