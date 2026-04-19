import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return NextResponse.json({ message: 'Döner House API is running' });
}

export async function POST(request, { params }) {
  return NextResponse.json({ message: 'OK' });
}
