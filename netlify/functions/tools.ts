
import { Handler } from '@netlify/functions';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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

// Load data from JSON files with multiple fallback paths
let tools: Tool[] = [];
let categories: Categories = { primary: [], secondary: [], pricing: [], platform: [] };

try {
  // Try different paths where data might be located in Netlify environment
  const possiblePaths = [
    join(process.cwd(), 'data/tools.json'),              // After build copy
    join(process.cwd(), 'server/data/tools.json'),       // Development
    join(process.cwd(), '../../data/tools.json'),        // Netlify function context
    join(process.cwd(), '../../server/data/tools.json'),
    './data/tools.json',                                 // Relative path
    '../../../data/tools.json',
  ];

  let toolsPath = '';
  for (const path of possiblePaths) {
    try {
      const content = readFileSync(path, 'utf-8');
      toolsPath = path;
      tools = JSON.parse(content);
      console.log(`Successfully loaded tools from: ${path}`);
      break;
    } catch {
      continue;
    }
  }

  if (toolsPath) {
    const categoriesPath = toolsPath.replace('tools.json', 'categories.json');
    try {
      categories = JSON.parse(readFileSync(categoriesPath, 'utf-8'));
      console.log(`Successfully loaded categories from: ${categoriesPath}`);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  } else {
    console.error('Failed to load tools from any path. Tried:', possiblePaths);
  }
} catch (error) {
  console.error('Error loading data files:', error);
}

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
    // Parse the path - handle both direct calls and rewrites
    const path = event.path.replace('/.netlify/functions/tools', '').replace('/.netlify/functions/categories', '');

    // GET /api/tools/:slug (single tool)
    const slugMatch = path.match(/^\/([a-z0-9-]+)$/);
    if (slugMatch) {
      const slug = slugMatch[1];
      const tool = tools.find((t) => t.slug === slug);
      
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
