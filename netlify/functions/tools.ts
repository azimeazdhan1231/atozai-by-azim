
import { Handler } from '@netlify/functions';
import toolsData from '../../server/data/tools.json';
import categoriesData from '../../server/data/categories.json';

interface Tool {
  id: number;
  name: string;
  slug: string;
  url: string;
  short_description: string;
  description: string;
  pricing: string;
  primary_category: string;
  secondary_category: string;
  platform_type: string;
}

interface Categories {
  primary: string[];
  secondary: string[];
  pricing: string[];
  platform: string[];
}

// Import data directly - it will be bundled into the function
const tools: Tool[] = toolsData as Tool[];
const categories: Categories = categoriesData as Categories;

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Log the event for debugging
    console.log('Event path:', event.path);
    console.log('Event pathParameters:', event.pathParameters);
    console.log('Event queryStringParameters:', event.queryStringParameters);
    
    // Extract slug from multiple possible sources
    // 1. Path parameters (Netlify's preferred method when using :slug in redirects)
    let slug = event.pathParameters?.slug;
    
    // 2. Query string parameters (for legacy /api/tools?slug=xyz format)
    if (!slug && event.queryStringParameters?.slug) {
      slug = event.queryStringParameters.slug;
    }
    
    // 3. Parse from path as fallback
    if (!slug) {
      const path = event.path
        .replace('/.netlify/functions/tools', '')
        .replace('/api/tools', '');
      
      // Match slug pattern: /slug-name
      const slugMatch = path.match(/^\/([a-z0-9-]+)$/);
      if (slugMatch) {
        slug = slugMatch[1];
      }
    }
    
    // GET /api/tools/:slug or /api/tools?slug=xyz (single tool by slug)
    if (slug) {
      const tool = tools.find((t) => t.slug === slug);
      
      if (!tool) {
        console.log(`Tool not found for slug: ${slug}`);
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Tool not found', slug }),
        };
      }

      console.log(`Found tool: ${tool.name}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(tool),
      };
    }

    // GET /api/tools (list with filters and pagination)
    const params = event.queryStringParameters || {};
    const page = parseInt(params.page || '1', 10);
    const limit = parseInt(params.limit || '24', 10);
    const search = params.search?.toLowerCase() || '';
    const primary_category = params.primary_category || '';
    const secondary_category = params.secondary_category || '';
    const platform_type = params.platform_type || '';
    
    // Handle pricing as array (can be multiple values)
    let pricingArray: string[] = [];
    if (params.pricing) {
      pricingArray = Array.isArray(params.pricing) ? params.pricing : [params.pricing];
    }

    let filteredTools = [...tools];

    // Apply search filter
    if (search) {
      filteredTools = filteredTools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(search) ||
          tool.short_description.toLowerCase().includes(search) ||
          tool.description.toLowerCase().includes(search) ||
          tool.primary_category.toLowerCase().includes(search) ||
          tool.secondary_category.toLowerCase().includes(search)
      );
    }

    // Apply pricing filter
    if (pricingArray.length > 0) {
      filteredTools = filteredTools.filter((tool) => 
        pricingArray.includes(tool.pricing)
      );
    }

    // Apply primary category filter
    if (primary_category) {
      filteredTools = filteredTools.filter(
        (tool) => tool.primary_category === primary_category
      );
    }

    // Apply secondary category filter
    if (secondary_category) {
      filteredTools = filteredTools.filter(
        (tool) => tool.secondary_category === secondary_category
      );
    }

    // Apply platform type filter
    if (platform_type) {
      filteredTools = filteredTools.filter((tool) => tool.platform_type === platform_type);
    }

    // Calculate pagination
    const total = filteredTools.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedTools = filteredTools.slice(offset, offset + limit);

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
  } catch (error) {
    console.error('Error in tools function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
