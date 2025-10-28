import { Handler } from '@netlify/functions';
import categoriesData from '../../server/data/categories.json';

interface Categories {
  primary: string[];
  secondary: string[];
  pricing: string[];
  platform: string[];
}

// Import data directly - it will be bundled into the function
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
