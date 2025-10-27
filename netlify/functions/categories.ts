import { Handler } from '@netlify/functions';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Categories {
  primary: string[];
  secondary: string[];
  pricing: string[];
  platform: string[];
}

// Load categories data with multiple fallback paths
let categories: Categories = { primary: [], secondary: [], pricing: [], platform: [] };

try {
  // Try different paths where data might be located in Netlify environment
  const possiblePaths = [
    join(process.cwd(), 'data/categories.json'),           // After build copy
    join(process.cwd(), 'server/data/categories.json'),    // Development
    join(process.cwd(), '../../data/categories.json'),     // Netlify function context
    join(process.cwd(), '../../server/data/categories.json'),
    './data/categories.json',                              // Relative path
    '../../../data/categories.json',
  ];

  let categoriesPath = '';
  for (const path of possiblePaths) {
    try {
      const content = readFileSync(path, 'utf-8');
      categoriesPath = path;
      categories = JSON.parse(content);
      console.log(`Successfully loaded categories from: ${path}`);
      break;
    } catch (err) {
      // Try next path
      continue;
    }
  }

  if (!categoriesPath) {
    console.error('Failed to load categories from any path. Tried:', possiblePaths);
  }
} catch (error) {
  console.error('Error loading categories data:', error);
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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(categories),
    };
  } catch (error) {
    console.error('Error in categories function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
