import { NextRequest, NextResponse } from 'next/server';

export const corsConfig = {
  // Allow all origins (including file:// - origin 'null')
  // In production, change to: ['https://yourdomain.com', 'http://localhost:3000']
  allowedOrigins: ['*'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

// Add CORS headers to any response
export function addCorsHeaders(response: NextResponse, origin?: string) {
  const allowedOrigin = corsConfig.allowedOrigins.includes('*') 
    ? (origin || '*') 
    : corsConfig.allowedOrigins.find(o => o === origin) || corsConfig.allowedOrigins[0];
    
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
  response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());
  
  return response;
}

// Handle OPTIONS preflight requests
export function handleCorsPreflight(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
      'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
      'Access-Control-Max-Age': corsConfig.maxAge.toString(),
    },
  });
}

// Wrapper to handle CORS automatically
export async function withCors(
  request: NextRequest, 
  handler: () => Promise<NextResponse>
) {
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return handleCorsPreflight(request);
  }
  
  // Execute handler and add CORS headers
  const origin = request.headers.get('origin') || '*';
  const response = await handler();
  return addCorsHeaders(response, origin);
}