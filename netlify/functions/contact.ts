import { Handler } from '@netlify/functions';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

// In-memory storage for contact messages (will reset on function cold start)
const contactMessages: (ContactMessage & { id: number; createdAt: string })[] = [];
let messageIdCounter = 1;

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: name, email, message' }),
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
    }

    // Validate field lengths
    if (body.name.length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name must be at least 2 characters' }),
      };
    }

    if (body.message.length < 10) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message must be at least 10 characters' }),
      };
    }

    // Create new message
    const newMessage = {
      id: messageIdCounter++,
      name: body.name,
      email: body.email,
      message: body.message,
      createdAt: new Date().toISOString(),
    };

    contactMessages.push(newMessage);

    // Log the message (in production, you'd save to database or send email)
    console.log('Contact form submission:', newMessage);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(newMessage),
    };
  } catch (error) {
    console.error('Error in contact function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to submit contact form' }),
    };
  }
};
