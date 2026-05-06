import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { orderSchema, validateData, sanitizeObject } from '@/lib/validations';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success, remaining, reset } = await rateLimit(ip, 30, 60000); // 30 requests per minute

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }

  return NextResponse.json(
    { message: 'WBS Menu Demo API is running' },
    {
      headers: {
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      }
    }
  );
}

export async function POST(request, { params }) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const path = params?.path || [];
  
  // Apply stricter rate limiting for POST requests
  const { success, remaining, reset } = await rateLimit(`post-${ip}`, 5, 60000); // 5 POSTs per minute

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }

  // Handle specific endpoints
  if (path.includes('order')) {
    try {
      const body = await request.json();
      
      // Sanitize input
      const sanitizedBody = sanitizeObject(body);
      
      // Validate data
      // Note: We might need to adjust the schema slightly if the payload differs
      // but let's use a basic check for now
      if (!sanitizedBody.customer_name || !sanitizedBody.phone || !sanitizedBody.address) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Proxy to Supabase
      const { data, error } = await supabase.from('orders').insert(sanitizedBody).select().single();
      
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } catch (err) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }

  return NextResponse.json({ message: 'OK' });
}
