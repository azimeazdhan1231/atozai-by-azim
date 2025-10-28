import { Handler } from '@netlify/functions';
import agentsData from '../../server/data/agents.json';

interface AgentTool {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  features: string[];
  freeTier: string;
}

// Import data directly - it will be bundled into the function
const agents: AgentTool[] = agentsData as AgentTool[];

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
