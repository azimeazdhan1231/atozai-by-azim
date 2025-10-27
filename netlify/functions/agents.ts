import { Handler } from '@netlify/functions';
import { readFileSync } from 'fs';
import { join } from 'path';

interface AgentTool {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  features: string[];
  freeTier: string;
}

// Load agents data from JSON file with multiple fallback paths
let agents: AgentTool[] = [];

try {
  const possiblePaths = [
    join(process.cwd(), 'data/agents.json'),
    join(process.cwd(), 'server/data/agents.json'),
    join(process.cwd(), '../../data/agents.json'),
    join(process.cwd(), '../../server/data/agents.json'),
    './data/agents.json',
    '../../../data/agents.json',
  ];

  let agentsPath = '';
  for (const path of possiblePaths) {
    try {
      const content = readFileSync(path, 'utf-8');
      agentsPath = path;
      agents = JSON.parse(content);
      console.log(`Successfully loaded agents from: ${path}`);
      break;
    } catch {
      continue;
    }
  }

  if (!agentsPath) {
    console.error('Failed to load agents from any path. Tried:', possiblePaths);
  }
} catch (error) {
  console.error('Error loading agents data file:', error);
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(agents),
    };
  } catch (error) {
    console.error('Error in agents function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch agents' }),
    };
  }
};
